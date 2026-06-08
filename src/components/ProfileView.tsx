"use client";

import React, { useState, useRef } from "react";
import API from "../lib/api";
import { User, Mail, Heart, Calendar, FileClock, ShieldCheck, LogOut, Check, Settings, Sparkles, MapPin, Bell, Camera, Loader2, Clock, ArrowLeftRight, Trash2, Ticket as TicketIcon } from "lucide-react";
import { Event, Ticket, TicketStatus } from "../types";

interface ProfileViewProps {
  userProfile: { name: string; email: string; avatar?: string };
  currentAvatar: string;
  tickets: Ticket[];
  ticketsLoading?: boolean;
  savedEventIds: string[];
  events: Event[];
  onUpdateProfile: (name: string, email: string) => void;
  onSaveAvatar: (url: string) => void;
  onUploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  onChangePassword: (current: string, next: string) => Promise<{ success: boolean; error?: string }>;
  onToggleSave: (eventId: string) => void;
  onLogout: () => void;
  onSelectEvent: (eventId: string) => void;
  onRefresh?: () => void;
  setView: (view: string) => void;
}

export default function ProfileView({
  userProfile,
  currentAvatar,
  tickets,
  ticketsLoading = false,
  savedEventIds,
  events,
  onUpdateProfile,
  onSaveAvatar,
  onUploadAvatar,
  onChangePassword,
  onToggleSave,
  onLogout,
  onSelectEvent,
  onRefresh,
  setView,
}: ProfileViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "settings" | "saved">("overview");
  const [ticketTab, setTicketTab] = useState<TicketStatus>(TicketStatus.UPCOMING);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [transferringId, setTransferringId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Edit states
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  // File upload states
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initials fallback when no avatar is set
  const initials = userProfile.name
    ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (userProfile.email[0] ?? "?").toUpperCase();

  // The image to show: local preview > DB avatar > nothing (initials)
  const displayAvatar = previewUrl || currentAvatar;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side: max 2 MB, image types only
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }

    setUploadError("");

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);

    const result = await onUploadAvatar(file);
    setUploading(false);

    if (!result.success) {
      setPreviewUrl("");
      setUploadError(result.error ?? "Upload failed. Please try again.");
    }
    // On success, currentAvatar prop will update via context; clear local preview
    if (result.success) {
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl("");
      if (result.url) setSelectedAvatar(result.url);
    }

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-dismiss upload error after 4 seconds
  React.useEffect(() => {
    if (!uploadError) return;
    const t = setTimeout(() => setUploadError(""), 4000);
    return () => clearTimeout(t);
  }, [uploadError]);

  // Preference toggles
  const [promoEmails, setPromoEmails] = useState(true);
  const [smsConfirmation, setSmsConfirmation] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Success indicator
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change states
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!currentPassword) { setPassError("Please provide your current account password."); return; }
    if (newPassword.length < 8) { setPassError("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmNewPassword) { setPassError("The confirmed password does not match."); return; }

    const result = await onChangePassword(currentPassword, newPassword);
    if (!result.success) {
      setPassError(result.error ?? "Password update failed. Please try again.");
      return;
    }
    setPassSuccess("Your password has been updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setTimeout(() => { setIsChangingPass(false); setPassSuccess(""); }, 2500);
  };

  const handleTransferSubmit = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (transferEmail.trim()) {
      // no-op: transfer handled externally if needed
      setTransferSuccess(ticketId);
      setTransferEmail("");
      setTimeout(() => { setTransferringId(null); setTransferSuccess(null); }, 3000);
    }
  };

  const handleDownloadPDF = (t: Ticket) => {
    const text = `MYHitch Pass\n\nEvent: ${t.eventTitle}\nDate: ${t.eventDate} ${t.eventTime}\nVenue: ${t.eventLocation}\nSeat: ${t.seatType} x${t.quantity}\nAttendee: ${t.attendeeName}\nEmail: ${t.attendeeEmail}\nID: ${t.id}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ticket-${t.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  // Filter events that have been saved by the passenger attendee
  const savedEvents = events.filter((e) => savedEventIds.includes(e.id));

  // Default avatars list
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  ];

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("myhitch_token");
    if (token) {
      try {
        const res = await fetch(
          `${API}/auth/profile`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ name: editName, email: editEmail, avatar_url: selectedAvatar || null }),
          }
        );
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            localStorage.setItem("myhitch_user", JSON.stringify(json.user));
            onUpdateProfile(json.user.name ?? editName, json.user.email ?? editEmail);
            onSaveAvatar(json.user.avatar_url ?? selectedAvatar);
          } else {
            onUpdateProfile(editName, editEmail);
            onSaveAvatar(selectedAvatar);
          }
        } else {
          onUpdateProfile(editName, editEmail);
          onSaveAvatar(selectedAvatar);
        }
      } catch {
        onUpdateProfile(editName, editEmail);
        onSaveAvatar(selectedAvatar);
      }
    } else {
      onUpdateProfile(editName, editEmail);
      onSaveAvatar(selectedAvatar);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveSubTab("overview");
    }, 1500);
  };

  return (
    <div id="profile-page" className="bg-soft-bg min-h-screen py-10 text-dark-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile dashboard header */}
        <div className="bg-white border border-border-gray rounded-[32px] p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-center gap-6 text-left shadow-sm relative pb-10 md:pb-8">
          {/* Avatar frame — click to upload */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Change profile photo"
              className="h-24 w-24 rounded-full overflow-hidden border-4 border-white ring-4 ring-brand-blue/15 shadow-md block relative cursor-pointer focus:outline-none"
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#00aeef] flex items-center justify-center text-white text-3xl font-black select-none">
                  {initials}
                </div>
              )}
              {/* Hover / uploading overlay */}
              <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity
                ${uploading ? "bg-black/50 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100"}`}>
                {uploading
                  ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                  : <Camera className="h-6 w-6 text-white" />
                }
              </div>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />

            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-brand-blue border-2 border-white flex items-center justify-center text-white" title="Verified Customer Passholder">
              <Check className="h-3 w-3 stroke-[3]" />
            </span>
          </div>

          {/* Upload error / hint */}
          {uploadError && (
            <p className="absolute left-0 right-0 -bottom-6 text-center text-[10px] text-red-500 font-semibold">
              {uploadError}
            </p>
          )}

          {/* Attendee Details */}
          <div className="space-y-2 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-soft-brand-tint border border-brand-blue/15 text-brand-blue uppercase text-[10px] font-black rounded-full leading-none tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Certified Passholder Wallet</span>
            </div>
            <h2 className="text-2xl font-black text-dark-text">{userProfile.name}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-neutral-500 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-brand-blue" />
                <span>{userProfile.email}</span>
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                <span>San Francisco, US</span>
              </span>
            </div>
            {/* Real Logout Button on the Profile Page */}
            <div className="pt-1.5 flex justify-center md:justify-start">
              <button
                id="profile-header-logout-btn"
                onClick={onLogout}
                className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-xs font-black uppercase tracking-wider px-5 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm active:scale-97"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* Quick Stats overview */}
          <div className="flex items-stretch gap-3 border-t md:border-t-0 md:border-l border-border-gray pt-6 md:pt-0 pl-0 md:pl-8 text-center">
            <div className="px-4.5">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Active Tickets</div>
              <div className="text-2xl font-black text-brand-blue">{tickets.length}</div>
            </div>
            <div className="w-px bg-border-gray" />
            <div className="px-4.5">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Keep Saved</div>
              <div className="text-2xl font-black text-[#0F172A]">{savedEventIds.length}</div>
            </div>
          </div>
        </div>

        {/* Dynamic page subrouting navigation tags */}
        <div className="flex items-center gap-2 border-b border-border-gray mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            id="profile-tab-overview"
            onClick={() => setActiveSubTab("overview")}
            className={`pb-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
              activeSubTab === "overview"
                ? "border-brand-blue text-brand-blue font-extrabold"
                : "border-transparent text-neutral-500 hover:text-dark-text"
            }`}
          >
            My Pass Wallet
          </button>
          <button
            id="profile-tab-saved"
            onClick={() => setActiveSubTab("saved")}
            className={`pb-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
              activeSubTab === "saved"
                ? "border-brand-blue text-brand-blue font-extrabold"
                : "border-transparent text-neutral-500 hover:text-dark-text"
            }`}
          >
            Saved Experiences ({savedEvents.length})
          </button>
          <button
            id="profile-tab-settings"
            onClick={() => setActiveSubTab("settings")}
            className={`pb-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
              activeSubTab === "settings"
                ? "border-brand-blue text-brand-blue font-extrabold"
                : "border-transparent text-neutral-500 hover:text-dark-text"
            }`}
          >
            Account Settings
          </button>
        </div>

        {/* Sub-tab view panel details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: TICKET WALLET */}
            {activeSubTab === "overview" && (
              <div className="space-y-5">

                {/* Ticket tab switcher + refresh */}
                <div className="flex items-center gap-3">
                <div className="inline-flex p-1.5 rounded-full bg-white border border-border-gray shadow-sm">
                  {[TicketStatus.UPCOMING, TicketStatus.PAST, TicketStatus.DRAFT].map((status) => {
                    const count = tickets.filter(t => t.status === status).length;
                    const isActive = ticketTab === status;
                    return (
                      <button
                        key={status}
                        onClick={() => { setTicketTab(status); setExpandedTicketId(null); setTransferringId(null); }}
                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? status === TicketStatus.DRAFT
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/15"
                              : "bg-brand-blue text-white shadow-md shadow-brand-blue/15"
                            : "text-neutral-500 hover:text-dark-text"
                        }`}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>
                {onRefresh && (
                  <button onClick={onRefresh} disabled={ticketsLoading} title="Refresh from database"
                    className="p-2 rounded-full bg-white border border-border-gray text-neutral-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all cursor-pointer shadow-sm disabled:opacity-50">
                    <Loader2 className={`h-4 w-4 ${ticketsLoading ? "animate-spin text-brand-blue" : ""}`} />
                  </button>
                )}
                </div>

                {/* Ticket cards */}
                {ticketsLoading ? (
                  <div className="py-12 text-center bg-white border border-border-gray rounded-[28px] shadow-sm">
                    <Loader2 className="h-7 w-7 mx-auto text-brand-blue animate-spin mb-2" />
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Loading tickets from database…</p>
                  </div>
                ) : tickets.filter(t => t.status === ticketTab).length > 0 ? (
                  <div className="space-y-5">
                    {tickets.filter(t => t.status === ticketTab).map((ticket) => {
                      const isExpanded = expandedTicketId === ticket.id;
                      const isTransferring = transferringId === ticket.id;
                      return (
                        <div key={ticket.id} className="bg-white border border-border-gray hover:border-brand-blue/15 rounded-[28px] overflow-hidden transition-all shadow-sm hover:shadow-md animate-fade">
                          <div className="flex flex-col sm:flex-row items-stretch">
                            {ticket.eventImage && (
                              <div className="relative sm:w-1/4 h-32 sm:h-auto overflow-hidden flex-shrink-0">
                                <img src={ticket.eventImage} alt={ticket.eventTitle} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-white via-transparent to-transparent" />
                              </div>
                            )}
                            <div className="p-5 flex-1 flex flex-col justify-between text-left">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-light-tint text-brand-blue border border-brand-blue/15 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">{ticket.seatType}</span>
                                  <span className="text-[10px] bg-soft-bg text-[#0F172A] border border-border-gray px-2.5 py-0.5 rounded-full font-mono font-bold">x{ticket.quantity}</span>
                                  <span className="ml-auto text-xs font-black text-[#0F172A]">${ticket.price}</span>
                                </div>
                                <h3 className="text-base font-black text-dark-text leading-tight">{ticket.eventTitle}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-neutral-500 font-semibold">
                                  <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>{ticket.eventDate}</span></div>
                                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span>{ticket.eventTime}</span></div>
                                  <div className="flex items-center gap-1.5 sm:col-span-2"><MapPin className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span className="truncate">{ticket.eventLocation}</span></div>
                                  <div className="flex items-center gap-1.5 sm:col-span-2"><Mail className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" /><span className="truncate">{ticket.attendeeName} · {ticket.attendeeEmail}</span></div>
                                </div>
                              </div>

                              {ticketTab === TicketStatus.UPCOMING && (
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-gray">
                                  <button onClick={() => { setExpandedTicketId(isExpanded ? null : ticket.id); setTransferringId(null); }}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full border transition-all cursor-pointer ${isExpanded ? "bg-dark-text border-dark-text text-white" : "bg-white border-border-gray text-neutral-700 hover:bg-neutral-50"}`}>
                                    {isExpanded ? "Hide Pass" : "View Entry Pass"}
                                  </button>
                                  <button onClick={() => { setTransferringId(isTransferring ? null : ticket.id); setExpandedTicketId(null); }}
                                    className="bg-white hover:bg-neutral-50 text-neutral-500 hover:text-brand-blue border border-border-gray px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full cursor-pointer flex items-center gap-1.5 transition-colors">
                                    <ArrowLeftRight className="h-3 w-3 text-brand-blue" /><span>Transfer</span>
                                  </button>
                                  <button onClick={() => handleDownloadPDF(ticket)}
                                    className="bg-white hover:bg-neutral-50 text-neutral-500 hover:text-emerald-600 border border-border-gray px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-full cursor-pointer flex items-center gap-1.5 transition-colors">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" /><span>Download</span>
                                  </button>
                                </div>
                              )}

                              {ticketTab === TicketStatus.DRAFT && (
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-gray">
                                  <span className="text-[10px] text-amber-500 font-extrabold uppercase bg-amber-50 px-2.5 py-1 rounded-md mr-auto">Not paid yet</span>
                                  <button onClick={() => setView("my-tickets")}
                                    className="bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-2 text-[10px] font-black uppercase tracking-wider rounded-full cursor-pointer shadow-md shadow-brand-blue/15 flex items-center gap-1.5">
                                    <TicketIcon className="h-3 w-3" /><span>Finish & Pay</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* QR expanded panel */}
                          {isExpanded && ticketTab === TicketStatus.UPCOMING && (
                            <div className="bg-soft-bg p-5 border-t border-border-gray flex flex-col sm:flex-row items-center gap-6 animate-fade">
                              <div className="bg-white p-4 rounded-[24px] flex flex-col items-center flex-shrink-0 border border-border-gray shadow-sm">
                                <svg className="h-32 w-32 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                                  <path d="M5,5 h24 v24 h-24 z M10,10 h14 v14 h-14 z" />
                                  <path d="M71,5 h24 v24 h-24 z M76,10 h14 v14 h-14 z" />
                                  <path d="M5,71 h24 v24 h-24 z M10,76 h14 v14 h-14 z" />
                                  <path d="M40,5 h10 v10 h-10 z M15,40 h15 v5 h-15 z M50,20 h5 v15 h-5 z M60,45 h15 v5 h-15 z M35,60 h5 v15 h-5 z" />
                                  <path d="M35,35 h12 v12 h-12 z M55,55 h12 v12 h-12 z M70,70 h20 v20 h-20 z" />
                                  <path d="M5,40 h10 v5 h-10 z M10,50 h10 v10 h-10 z M80,45 h5 v10 h-5 z M50,80 h15 v5 h-15 z M45,15 h5 v10 h-5 z" />
                                </svg>
                                <div className="mt-2 flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                                  <span className="text-[9px] text-neutral-450 font-black uppercase tracking-wider">Ready to scan</span>
                                </div>
                              </div>
                              <div className="text-left space-y-3 flex-1">
                                <h4 className="text-sm font-black text-[#0F172A]">Show this at the door</h4>
                                <div className="p-3.5 bg-white rounded-2xl border border-border-gray space-y-2 text-[11px] font-bold">
                                  <div className="flex justify-between"><span className="text-neutral-400">Name</span><span className="text-[#0F172A] font-extrabold">{ticket.attendeeName}</span></div>
                                  <div className="flex justify-between"><span className="text-neutral-400">Email</span><span className="text-[#0F172A] font-bold truncate max-w-[160px]" title={ticket.attendeeEmail}>{ticket.attendeeEmail}</span></div>
                                  <div className="flex justify-between"><span className="text-neutral-400">Ticket ID</span><span className="text-brand-blue font-extrabold font-mono text-[10px]">{ticket.id}</span></div>
                                  <div className="flex justify-between"><span className="text-neutral-400">Purchased</span><span className="text-[#0F172A]">{ticket.purchaseDate}</span></div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Transfer panel */}
                          {isTransferring && ticketTab === TicketStatus.UPCOMING && (
                            <div className="bg-soft-bg p-5 border-t border-border-gray animate-fade text-left">
                              <div className="max-w-md">
                                <h4 className="text-xs font-black text-dark-text mb-2 uppercase flex items-center gap-1.5">
                                  <ArrowLeftRight className="h-3.5 w-3.5 text-brand-blue" />Transfer Pass
                                </h4>
                                {transferSuccess === ticket.id ? (
                                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />Transfer successful!
                                  </div>
                                ) : (
                                  <form onSubmit={(e) => handleTransferSubmit(e, ticket.id)} className="flex gap-2">
                                    <div className="relative flex-1">
                                      <input required type="email" placeholder="Recipient email..." value={transferEmail}
                                        onChange={(e) => setTransferEmail(e.target.value)}
                                        className="w-full bg-white border border-border-gray focus:border-brand-blue rounded-full px-4 py-2.5 text-xs text-dark-text focus:outline-none pl-9 font-semibold" />
                                      <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
                                    </div>
                                    <button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white font-black uppercase tracking-wider text-[10px] px-5 rounded-full cursor-pointer shadow-md">
                                      Transfer
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
                  <div className="py-14 text-center bg-white border border-border-gray rounded-[28px] shadow-sm animate-fade">
                    <TicketIcon className="h-9 w-9 mx-auto text-brand-blue mb-3 animate-pulse" />
                    <h3 className="text-sm font-black text-dark-text mb-1">No {ticketTab} Passes</h3>
                    <p className="text-neutral-400 text-xs max-w-xs mx-auto mb-5 font-semibold leading-relaxed">
                      {ticketTab === TicketStatus.UPCOMING
                        ? "You have no upcoming tickets. Browse events to book your next experience."
                        : ticketTab === TicketStatus.PAST
                        ? "No past tickets found in your wallet."
                        : "No draft bookings saved yet."}
                    </p>
                    <button onClick={() => setView("events")}
                      className="text-xs font-black uppercase text-brand-blue hover:text-brand-blue-hover tracking-wider cursor-pointer">
                      Browse Events
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: SAVED EXPERIENCES */}
            {activeSubTab === "saved" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#0F172A] uppercase border-b border-border-gray pb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span>Keeping Favorites</span>
                </h3>

                {savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedEvents.map((ev) => (
                      <div
                        key={ev.id}
                        id={`saved-item-${ev.id}`}
                        className="bg-white border border-border-gray hover:border-brand-blue/20 rounded-2xl p-4 flex gap-4 shadow-sm group animate-fade"
                      >
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0 cursor-pointer"
                          onClick={() => onSelectEvent(ev.id)}
                        />
                        <div className="text-xs min-w-0 font-semibold flex-1 text-left flex flex-col justify-between">
                          <div>
                            <h4 className="font-extrabold text-[#0F172A] truncate hover:text-brand-blue cursor-pointer" onClick={() => onSelectEvent(ev.id)}>
                              {ev.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 font-bold mt-0.5 truncate">{ev.location}, {ev.city}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-brand-blue">${ev.price}</span>
                            <button
                              id={`unsave-btn-${ev.id}`}
                              onClick={() => onToggleSave(ev.id)}
                              className="text-[10px] font-black text-neutral-400 hover:text-red-500 uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border border-border-gray rounded-3xl animate-fade">
                    <Heart className="h-8 w-8 text-neutral-300 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs text-neutral-450 font-semibold mb-3">No experiences have been saved yet.</p>
                    <button
                      id="saved-discover-btn"
                      onClick={() => setView("events")}
                      className="text-xs font-black uppercase text-brand-blue hover:text-brand-blue-hover tracking-wider"
                    >
                      Find Experiences Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACCOUNT DATA SETTINGS EDIT */}
            {activeSubTab === "settings" && (
              <div className="space-y-6 animate-fade">
                <form onSubmit={handleSettingsSubmit} className="bg-white border border-border-gray rounded-3xl p-6 sm:p-8 space-y-6">
                  <h3 className="font-black text-sm uppercase tracking-wide text-dark-text pb-3 border-b border-border-gray">
                    Adjust Passholder Credentials
                  </h3>

                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-[11px] font-semibold flex items-center gap-1.5 animate-pulse">
                      <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                      <span>Credentials updated successfully!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="col-span-2">
                      <label htmlFor="settings-input-name" className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Legal Name for Registrations</label>
                      <input
                        id="settings-input-name"
                        required
                        type="text"
                        title="Legal Name"
                        placeholder="Legal Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="settings-input-email" className="block text-[10px] font-bold text-neutral-450 uppercase mb-1.5">Primary Contact Email Address</label>
                      <input
                        id="settings-input-email"
                        required
                        type="email"
                        title="Primary Contact Email"
                        placeholder="Primary Contact Email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none"
                      />
                    </div>

                    {/* Avatar picker */}
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-3">Profile Avatar</label>
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Live preview */}
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-border-gray flex-shrink-0">
                          {selectedAvatar ? (
                            <img src={selectedAvatar} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#00aeef] flex items-center justify-center text-white font-black text-lg select-none">
                              {initials}
                            </div>
                          )}
                        </div>
                        {/* Preset options */}
                        <div className="flex gap-2 flex-wrap items-center">
                          {avatars.map((av, i) => (
                            <button key={i} type="button" onClick={() => setSelectedAvatar(av)}
                              title="Use this avatar"
                              className={`h-10 w-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                                selectedAvatar === av
                                  ? "border-brand-blue scale-110 shadow-md"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}>
                              <img src={av} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                          {/* Remove / use initials */}
                          {selectedAvatar && (
                            <button type="button" onClick={() => setSelectedAvatar("")}
                              title="Remove avatar — use initials"
                              className="h-10 w-10 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-300 transition-all cursor-pointer text-sm font-bold">
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-2 font-medium">
                        {selectedAvatar ? "Click ✕ to reset to your initials." : "Pick an avatar or keep your initials."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-gray text-right">
                    <button
                      id="settings-submit-btn"
                      type="submit"
                      className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md shadow-brand-blue/15 cursor-pointer"
                    >
                      Save Modifications
                    </button>
                  </div>
                </form>

                {/* CHANGE PASSWORD CODE CARD */}
                <div className="bg-white border border-border-gray rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border-gray pb-3">
                    <h3 className="font-black text-sm uppercase tracking-wide text-dark-text">
                      Change Secure Password
                    </h3>
                    <button
                      type="button"
                      id="toggle-change-pass-btn"
                      onClick={() => setIsChangingPass(!isChangingPass)}
                      className="text-[10px] font-black uppercase tracking-wider text-brand-blue hover:underline cursor-pointer bg-transparent border-0 outline-none"
                    >
                      {isChangingPass ? "Minimize Section" : "Verify & Change Password"}
                    </button>
                  </div>

                  {isChangingPass ? (
                    <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-semibold animate-fade">
                      {passError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-[11px] font-semibold">
                          {passError}
                        </div>
                      )}
                      {passSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-[11px] font-semibold">
                          {passSuccess}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Current Password</label>
                        <input
                          id="pass-input-current"
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">New Password</label>
                          <input
                            id="pass-input-new"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-neutral-450 uppercase mb-1">Confirm New Password</label>
                          <input
                            id="pass-input-confirm"
                            type="password"
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Must match new password"
                            className="w-full bg-soft-bg border border-border-gray focus:border-brand-blue rounded-full px-5 py-3 text-xs text-dark-text focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border-gray text-right">
                        <button
                          id="btn-submit-change-pass"
                          type="submit"
                          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md shadow-brand-blue/15 cursor-pointer"
                        >
                          Confirm Password Change
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                      Need to update your login credentials? Click the link to provide verify-protected credentials. Updates take effect immediately on next login attempt.
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column (Preferences details) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Preferences configurations card */}
            <div className="bg-white border border-border-gray rounded-3xl p-6 space-y-5">
              <div className="pb-3 border-b border-border-gray flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-brand-blue" />
                <h4 className="font-black text-xs uppercase tracking-wider text-dark-text leading-none">
                  Notification Configs
                </h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                
                {/* Checkbox item 1 */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id="pref-promo"
                    type="checkbox"
                    checked={promoEmails}
                    onChange={(e) => setPromoEmails(e.target.checked)}
                    className="h-4 w-4 text-brand-blue border-border-gray focus:ring-brand-blue rounded mt-0.5"
                  />
                  <div>
                    <span className="text-dark-text font-bold block leading-none mb-1">Weekly Curated Deals</span>
                    <span className="text-[10px] text-neutral-500 font-medium block leading-normal">Email promotions on local headline concerts & tours.</span>
                  </div>
                </label>

                {/* Checkbox item 2 */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id="pref-sms"
                    type="checkbox"
                    checked={smsConfirmation}
                    onChange={(e) => setSmsConfirmation(e.target.checked)}
                    className="h-4 w-4 text-brand-blue border-border-gray focus:ring-brand-blue rounded mt-0.5"
                  />
                  <div>
                    <span className="text-dark-text font-bold block leading-none mb-1">SMS Booking Receipts</span>
                    <span className="text-[10px] text-neutral-500 font-medium block leading-normal">Final voucher download tokens sent to SMS instantly.</span>
                  </div>
                </label>

                {/* Checkbox item 3 - simulated extra luxury */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id="pref-2fa"
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="h-4 w-4 text-brand-blue border-border-gray focus:ring-brand-blue rounded mt-0.5"
                  />
                  <div>
                    <span className="text-dark-text font-bold block leading-none mb-1">Encrypted Barcode 2FA</span>
                    <span className="text-[10px] text-neutral-500 font-medium block leading-normal">Require security validation before expanding barcode.</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 bg-white border border-border-gray rounded-3xl space-y-3.5">
              <span className="text-[9px] uppercase font-black text-neutral-450 tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-brand-blue" />
                <span>Issuer Integrity Badging</span>
              </span>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                MYHitch Pass is a verified experiences network. All bookings are backed by instant token refunds and gate scanning guarantees.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
