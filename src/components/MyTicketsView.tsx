"use client";

import React, { useState } from "react";
import { TicketStatus, Ticket as TicketType } from "../types";
import { Calendar, MapPin, Clock, ShieldCheck, Mail, Sparkles, Trash2, ArrowLeftRight, Ticket as TicketIcon, RefreshCw, Loader2 } from "lucide-react";

interface MyTicketsViewProps {
  tickets: TicketType[];
  loading?: boolean;
  onCancelTicket: (ticketId: string) => void;
  onTransferTicket: (ticketId: string, email: string) => void;
  onResumeDraftCheckout?: (ticket: TicketType) => void;
  onRefresh?: () => void;
}

export default function MyTicketsView({
  tickets,
  loading = false,
  onCancelTicket,
  onTransferTicket,
  onResumeDraftCheckout,
  onRefresh,
}: MyTicketsViewProps) {
  const [activeTab, setActiveTab] = useState<TicketStatus>(TicketStatus.UPCOMING);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  
  // Transfer flow states
  const [transferringId, setTransferringId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const filteredTickets = tickets.filter((t) => t.status === activeTab);

  const handleDownloadPDF = (ticket: TicketType) => {
    const textVoucher = `
========================================================================
                      MYHITCH PASS - CERTIFIED ADMISSIONS
========================================================================
SECURE VORTEX ID: HITCH-${ticket.id.toUpperCase()}
LICENSED ATTENDEE: ${ticket.attendeeName}
VERIFIED EMAIL: ${ticket.attendeeEmail}
VALIDATION HASH: md5-hitch-${Math.random().toString(36).substring(3, 11)}

--------------------- INVITATION SPECIFICATIONS ---------------------
EVENT TITLE: ${ticket.eventTitle}
SCHEDULED DATE: ${ticket.eventDate}
SCHEDULED TIME: ${ticket.eventTime}
LOCATION/VENUE: ${ticket.eventLocation}

------------------------- SEATING SELECTION -------------------------
RESERVED TIER: ${ticket.seatType}
COMPLIMENTARY PASSES: ${ticket.quantity}x Entry Grants

Admissions Guidelines:
- Present this document or your physical holographic code at active turnstiles.
- Verification checks require valid ID matching passenger details.
- Duplication is tracked cryptographically with instant blacklist rules.

========================================================================
       PCI-DSS SECURE GATE CONFIRMED • MYHITCH PASS ONLINE SYSTEMS
========================================================================
`;
    // Generate certified text voucher Blob mimicking transactional receipt delivery
    const blob = new Blob([textVoucher], { type: "text/plain;charset=utf-8" });
    const localUrl = URL.createObjectURL(blob);
    const virtualLink = document.createElement("a");
    virtualLink.href = localUrl;
    virtualLink.download = `MYHitchPass_Voucher_${ticket.id}.txt`;
    virtualLink.click();
    URL.revokeObjectURL(localUrl);
  };

  const handleTransferSubmit = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (transferEmail.trim()) {
      onTransferTicket(ticketId, transferEmail);
      setTransferSuccess(ticketId);
      setTransferEmail("");
      setTimeout(() => {
        setTransferringId(null);
        setTransferSuccess(null);
      }, 3000);
    }
  };

  return (
    <div id="tickets-view-container" className="bg-soft-bg min-h-screen py-10 text-dark-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-left border-b border-border-gray pb-6">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-blue font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Attendee Pass Wallet</span>
            </span>
            <h1 className="text-3xl font-black text-dark-text tracking-tight">My Secure Tickets</h1>
            <p className="text-neutral-500 text-xs font-semibold leading-relaxed">
              Manage your upcoming events, sports check-ins, and transfer credentials instantly.
            </p>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh tickets"
              className="p-2 rounded-full bg-white border border-border-gray text-neutral-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}

          {/* Compact filter switcher */}
          <div className="inline-flex p-1.5 rounded-full bg-white border border-border-gray self-start shadow-sm">
            <button
              id="ticket-tab-upcoming"
              onClick={() => {
                setActiveTab(TicketStatus.UPCOMING);
                setExpandedTicketId(null);
                setTransferringId(null);
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === TicketStatus.UPCOMING
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15"
                  : "text-neutral-500 hover:text-dark-text"
              }`}
            >
              Upcoming ({tickets.filter((t) => t.status === TicketStatus.UPCOMING).length})
            </button>
            <button
              id="ticket-tab-past"
              onClick={() => {
                setActiveTab(TicketStatus.PAST);
                setExpandedTicketId(null);
                setTransferringId(null);
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === TicketStatus.PAST
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15"
                  : "text-neutral-500 hover:text-dark-text"
              }`}
            >
              Past ({tickets.filter((t) => t.status === TicketStatus.PAST).length})
            </button>
            <button
              id="ticket-tab-draft"
              onClick={() => {
                setActiveTab(TicketStatus.DRAFT);
                setExpandedTicketId(null);
                setTransferringId(null);
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === TicketStatus.DRAFT
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/15"
                  : "text-neutral-500 hover:text-dark-text"
              }`}
            >
              Drafts ({tickets.filter((t) => t.status === TicketStatus.DRAFT).length})
            </button>
          </div>
        </div>

        {/* Tickets Grid list */}
        {loading && tickets.length === 0 ? (
          <div className="py-16 text-center bg-white border border-border-gray rounded-[32px] shadow-sm animate-fade space-y-4">
            <Loader2 className="h-8 w-8 mx-auto text-brand-blue animate-spin" />
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Loading your tickets from database...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => {
              const isExpanded = expandedTicketId === ticket.id;
              const isTransferring = transferringId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  id={`ticket-card-${ticket.id}`}
                  className="bg-white border border-border-gray hover:border-brand-blue/15 rounded-[32px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md animate-fade"
                >
                  <div className="flex flex-col md:flex-row items-stretch">
                    
                    {/* Event thumbnail */}
                    <div className="relative md:w-1/4 h-36 md:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={ticket.eventImage}
                        alt={ticket.eventTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent md:via-white/20" />
                    </div>

                    {/* Pass overview details */}
                    <div className="p-6 flex-1 flex flex-col justify-between text-left">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-light-tint text-brand-blue border border-brand-blue/15 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {ticket.seatType}
                          </span>
                          <span className="text-[10px] bg-soft-bg text-[#0F172A] border border-border-gray px-2.5 py-0.5 rounded-full font-mono font-bold">
                            Qty: {ticket.quantity}x
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-dark-text leading-tight">
                          {ticket.eventTitle}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-neutral-500 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                            <span>{ticket.eventDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                            <span>{ticket.eventTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <MapPin className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                            <span className="truncate">{ticket.eventLocation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive controllers */}
                      {activeTab === TicketStatus.UPCOMING && (
                        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-border-gray">
                          <button
                            id={`qr-toggle-btn-${ticket.id}`}
                            onClick={() => {
                              setExpandedTicketId(isExpanded ? null : ticket.id);
                              setTransferringId(null);
                            }}
                            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm border ${
                              isExpanded
                                ? "bg-dark-text border-dark-text text-white shadow-md shadow-dark-text/15"
                                : "bg-white hover:bg-neutral-50 border-border-gray text-neutral-700"
                            }`}
                          >
                            {isExpanded ? "Collapse Pass" : "View Entry Pass"}
                          </button>
                          
                          <button
                            id={`transfer-toggle-btn-${ticket.id}`}
                            onClick={() => {
                              setTransferringId(isTransferring ? null : ticket.id);
                              setExpandedTicketId(null);
                            }}
                            className="bg-white hover:bg-neutral-50 text-neutral-500 hover:text-brand-blue border border-border-gray px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5 text-brand-blue" />
                            <span>Transfer Ticket</span>
                          </button>

                          <button
                            id={`pdf-download-btn-${ticket.id}`}
                            onClick={() => handleDownloadPDF(ticket)}
                            className="bg-white hover:bg-neutral-50 text-neutral-500 hover:text-emerald-600 border border-border-gray px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Download PDF Receipt</span>
                          </button>

                          <button
                            id={`cancel-ticket-btn-${ticket.id}`}
                            onClick={() => {
                              if (confirm("Are you sure you want to cancel this booking registration? This releases seats instantly back to the public network.")) {
                                onCancelTicket(ticket.id);
                              }
                            }}
                            className="p-2.5 hover:bg-red-50 text-neutral-400 hover:text-red-650 rounded-full transition-colors ml-auto cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      )}

                      {activeTab === TicketStatus.DRAFT && (
                        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-border-gray">
                          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-md mr-auto">
                            Not paid yet
                          </span>
                          <button
                            id={`resume-draft-btn-${ticket.id}`}
                            onClick={() => onResumeDraftCheckout?.(ticket)}
                            className="bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md shadow-brand-blue/15 flex items-center gap-1.5 active:scale-97"
                          >
                            <TicketIcon className="h-3.5 w-3.5" />
                            <span>Finish & pay</span>
                          </button>
                          
                          <button
                            id={`delete-draft-btn-${ticket.id}`}
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this draft pass?")) {
                                onCancelTicket(ticket.id);
                              }
                            }}
                            className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-650 rounded-full transition-colors cursor-pointer"
                            title="Delete Draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expand Block: Visual Barcode / QR with Scanning Emulation */}
                  {isExpanded && activeTab === TicketStatus.UPCOMING && (
                    <div id={`qr-expanded-${ticket.id}`} className="bg-soft-bg p-6 border-t border-border-gray flex flex-col md:flex-row items-center gap-8 animate-fade">
                      {/* Interactive Custom SVG QR Code */}
                      <div className="bg-white p-4.5 rounded-[32px] flex flex-col items-center justify-center flex-shrink-0 relative border border-border-gray shadow-sm group">
                        <svg className="h-40 w-40 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M5,5 h24 v24 h-24 z M10,10 h14 v14 h-14 z" />
                          <path d="M71,5 h24 v24 h-24 z M76,10 h14 v14 h-14 z" />
                          <path d="M5,71 h24 v24 h-24 z M10,76 h14 v14 h-14 z" />
                          <path d="M40,5 h10 v10 h-10 z M15,40 h15 v5 h-15 z M50,20 h5 v15 h-5 z M60,45 h15 v5 h-15 z M35,60 h5 v15 h-5 z" />
                          <path d="M35,35 h12 v12 h-12 z M55,55 h12 v12 h-12 z M70,70 h20 v20 h-20 z" />
                          <path d="M5,40 h10 v5 h-10 z M10,50 h10 v10 h-10 z M80,45 h5 v10 h-5 z M50,80 h15 v5 h-15 z M45,15 h5 v10 h-5 z" />
                          <path d="M90,35 h5 v15 h-5 z M5,60 h5 v5 h-5 z M20,65 h10 v5 h-10 z M75,55 h10 v5 h-10 z M60,75 h5 v10 h-5 z" />
                        </svg>
                        
                        {/* Interactive scan blink indicator */}
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                          <span className="text-[10px] text-neutral-450 font-black uppercase tracking-wider leading-none">Ready to scan at the door</span>
                        </div>
                      </div>

                      {/* Instructions panel */}
                      <div className="text-left space-y-3 flex-1">
                        <h4 className="text-base font-black text-[#0F172A] leading-none">Your ticket — show this at the door</h4>
                        <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                          Just open this page on your phone when you arrive. Staff will scan the code and let you in.
                        </p>
                        <div className="p-4 bg-white rounded-2xl border border-border-gray space-y-2.5 text-[11px] font-bold">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Name on ticket</span>
                            <span className="text-[#0F172A] font-extrabold">{ticket.attendeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400 truncate max-w-[130px]">Confirmation Address</span>
                            <span className="text-[#0F172A] font-bold truncate max-w-[170px]" title={ticket.attendeeEmail}>{ticket.attendeeEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Issued On Platform</span>
                            <span className="text-brand-blue font-extrabold">MYHitch Pass Certified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transfer input panel */}
                  {isTransferring && activeTab === TicketStatus.UPCOMING && (
                    <div id={`transfer-panel-${ticket.id}`} className="bg-soft-bg p-6 border-t border-border-gray animate-fade text-left">
                      <div className="max-w-md">
                        <h4 className="text-sm font-black text-dark-text mb-2 flex items-center gap-1.5 uppercase font-mono">
                          <ArrowLeftRight className="h-4 w-4 text-brand-blue" />
                          <span>Delegate Pass Authority</span>
                        </h4>
                        <p className="text-neutral-500 text-xs mb-4 leading-relaxed font-semibold">
                          Enter your beneficiary&apos;s e-mail credentials to delegate this pass. They will receive a certified copy, and your current token will invalidate immediately.
                        </p>

                        {transferSuccess === ticket.id ? (
                          <div id={`transfer-success-${ticket.id}`} className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            <span>Token transfer successful! Delivering link to beneficiary...</span>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleTransferSubmit(e, ticket.id)} className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                id={`transfer-input-email-${ticket.id}`}
                                required
                                type="email"
                                placeholder="Beneficiary e-mail address..."
                                value={transferEmail}
                                onChange={(e) => setTransferEmail(e.target.value)}
                                className="w-full bg-white border border-border-gray focus:border-brand-blue rounded-full px-4 py-2.5 text-xs text-dark-text focus:outline-none pl-9 font-semibold shadow-sm"
                              />
                              <Mail className="absolute left-3 top-3  h-3.5 w-3.5 text-neutral-400" />
                            </div>
                            <button
                              id={`transfer-submit-btn-${ticket.id}`}
                              type="submit"
                              className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase tracking-wider text-[10px] px-5 rounded-full cursor-pointer shadow-md shadow-brand-blue/15 transition-all"
                            >
                              Transfer Pass
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Wallet card */
          <div id="empty-wallet-container" className="py-16 text-center bg-white border border-border-gray rounded-[32px] shadow-sm animate-fade">
            <TicketIcon className="h-10 w-10 mx-auto text-brand-blue mb-3 animate-pulse" />
            <h3 className="text-lg font-black text-dark-text mb-1.5">No Passes Stored</h3>
            <p className="text-neutral-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed font-semibold">
              Your digital admission tickets wallet is currently empty. Head over to our homepage to find exciting new experiences.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
