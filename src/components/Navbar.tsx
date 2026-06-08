import { useState } from "react";
import Link from "next/link";
import { User, Menu, X, ChevronDown, Calendar, Tag, Star, ShoppingCart, Sparkles } from "lucide-react";

interface NavbarProps {
  currentView: string;
  setView: (view: string, eventId?: string) => void;
  cartCount: number;
  ticketCount: number;
  userProfile: { name: string; email: string; avatar?: string };
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  setView,
  cartCount,
  userProfile,
  isLoggedIn,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);

  const handleNav = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  const isEventsActive = ["upcoming", "events", "broadway-tickets"].includes(currentView);

  return (
    <>
      <nav id="app-nav" className="sticky top-0 z-50 shadow-md">
        {/* Gradient accent stripe */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#00AEEF] via-purple-400 to-pink-400" />

        {/* Main bar */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[60px] sm:h-[66px]">

              {/* Logo */}
              <div
                className="flex items-center shrink-0 cursor-pointer group select-none"
                onClick={() => handleNav("home")}
              >
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="MYHitchPass Logo"
                    className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-black tracking-tight uppercase font-sans transition-opacity group-hover:opacity-80">
                    MYHitch<span className="text-brand-blue">Pass</span>
                  </span>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center justify-center grow mx-4">
                <div className="flex items-center gap-0.5">

                  {/* Nav button helper — renders a styled link with animated underline */}
                  {[
                    { label: "Home", view: "home" },
                    { label: "Become an Organiser", view: "organiser-sop" },
                    { label: "Pricing", view: "pricing" },
                    { label: "Servicers", view: "servicers" },
                  ].map(({ label, view }) => {
                    const active = currentView === view;
                    return (
                      <button
                        key={view}
                        id={`nav-btn-${view}`}
                        onClick={() => handleNav(view)}
                        className={`relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group rounded-lg ${
                          active
                            ? "text-brand-blue"
                            : "text-neutral-500 hover:text-dark-text"
                        }`}
                      >
                        {label}
                        {/* animated underline */}
                        <span
                          className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-brand-blue transition-all duration-300 ${
                            active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100"
                          }`}
                        />
                      </button>
                    );
                  })}

                  {/* Events Dropdown */}
                  <div className="relative">
                    <button
                      id="nav-btn-events-dropdown"
                      onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                      className={`relative flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group rounded-lg ${
                        isEventsActive ? "text-brand-blue" : "text-neutral-500 hover:text-dark-text"
                      }`}
                    >
                      <span>Events</span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${eventsDropdownOpen ? "rotate-180" : ""}`}
                      />
                      <span
                        className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-brand-blue transition-all duration-300 ${
                          isEventsActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100"
                        }`}
                      />
                    </button>

                    {eventsDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setEventsDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 animate-fade overflow-hidden">
                          {/* Coloured top accent inside dropdown */}
                          <div className="h-[2px] w-full bg-gradient-to-r from-brand-blue via-purple-400 to-pink-400 mb-1" />
                          <button
                            onClick={() => { handleNav("upcoming"); setEventsDropdownOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-brand-blue hover:bg-sky-50/60 transition-colors"
                          >
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            Upcoming Events
                          </button>
                          <button
                            onClick={() => { handleNav("events"); setEventsDropdownOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-brand-blue hover:bg-sky-50/60 transition-colors"
                          >
                            <Tag className="h-3.5 w-3.5 shrink-0" />
                            Categories
                          </button>
                          <button
                            onClick={() => { handleNav("broadway-tickets"); setEventsDropdownOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-brand-blue hover:bg-sky-50/60 transition-colors"
                          >
                            <Star className="h-3.5 w-3.5 shrink-0" />
                            Broadway Tickets
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {[
                    { label: "Contact Us", view: "contact" },
                    { label: "About Us", view: "about" },
                  ].map(({ label, view }) => {
                    const active = currentView === view;
                    return (
                      <button
                        key={view}
                        id={`nav-btn-${view}`}
                        onClick={() => handleNav(view)}
                        className={`relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group rounded-lg ${
                          active ? "text-brand-blue" : "text-neutral-500 hover:text-dark-text"
                        }`}
                      >
                        {label}
                        <span
                          className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-brand-blue transition-all duration-300 ${
                            active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Actions */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {/* Cart — always visible */}
                <button
                  id="nav-btn-cart"
                  onClick={() => handleNav("cart")}
                  title="View Cart"
                  className={`relative p-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    currentView === "cart"
                      ? "bg-sky-50 border-brand-blue/30 text-brand-blue"
                      : "border-slate-200 text-neutral-500 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-sky-50/50"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[9px] font-black text-white ring-1 ring-white">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Post an Event — creative CTA */}
                <Link
                  href="/organiser/signup"
                  className="relative flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.04] overflow-hidden group shadow-lg shadow-purple-500/25"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #00aeef, #ec4899)", backgroundSize: "200% 200%" }}
                >
                  {/* animated shimmer overlay */}
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                  <Sparkles className="h-3.5 w-3.5 text-white relative z-10" />
                  <span className="relative z-10 text-white">Post an Event</span>
                </Link>

                {/* Profile + Logout — only for logged-in organizers */}
                {isLoggedIn && (
                  <button
                    id="nav-profile-btn"
                    onClick={() => handleNav("profile")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                      currentView === "profile"
                        ? "bg-sky-50 border-brand-blue/30 text-brand-blue"
                        : "border-slate-200 text-neutral-600 hover:border-brand-blue/40 hover:text-brand-blue hover:bg-sky-50/50"
                    }`}
                  >
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-blue to-purple-400 flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    Profile
                  </button>
                )}
              </div>

              {/* Mobile toggles */}
              <div className="lg:hidden flex items-center gap-2">
                <button
                  id="nav-btn-mobile-cart"
                  onClick={() => handleNav("cart")}
                  className={`relative p-2 rounded-xl cursor-pointer transition-colors ${
                    currentView === "cart"
                      ? "text-brand-blue bg-sky-50"
                      : "text-neutral-500 hover:text-dark-text hover:bg-neutral-100"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[8px] font-bold text-white ring-1 ring-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  id="nav-btn-menu"
                  title="Open Menu"
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 rounded-xl text-neutral-500 hover:text-dark-text hover:bg-neutral-100 focus:outline-none cursor-pointer transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" id="mobile-menu-portal">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade z-10"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 left-0 bottom-0 w-[290px] max-w-[85%] bg-white z-20 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in border-r border-neutral-200">
            {/* Gradient top accent */}
            <div className="h-[3px] w-full bg-gradient-to-r from-brand-blue via-purple-400 to-pink-400" />

            <div className="flex-1 px-6 pt-5 pb-4 space-y-6">
              {/* Close button */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Menu</span>
                <button
                  id="mobile-close-drawer-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-dark-text cursor-pointer transition-colors"
                >
                  Close
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col space-y-1 pt-1">
                {[
                  { label: "Home", view: "home" },
                  { label: "Become an Organiser", view: "organiser-sop" },
                  { label: "Pricing", view: "pricing" },
                  { label: "Servicers", view: "servicers" },
                ].map(({ label, view }) => (
                  <button
                    key={view}
                    onClick={() => handleNav(view)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-base font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                      currentView === view
                        ? "bg-sky-50 text-brand-blue"
                        : "text-neutral-800 hover:bg-neutral-50 hover:text-brand-blue"
                    }`}
                  >
                    {label}
                  </button>
                ))}

                {/* Events Accordion */}
                <div>
                  <button
                    onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-base font-bold tracking-tight flex items-center justify-between transition-all duration-150 cursor-pointer ${
                      isEventsActive ? "bg-sky-50 text-brand-blue" : "text-neutral-800 hover:bg-neutral-50 hover:text-brand-blue"
                    }`}
                  >
                    <span>Events</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileEventsOpen ? "rotate-180" : ""}`} />
                  </button>

                  {mobileEventsOpen && (
                    <div className="ml-4 mt-1 mb-1 pl-3 border-l-2 border-brand-blue/20 flex flex-col gap-1 animate-fade">
                      {[
                        { label: "Upcoming Events", view: "upcoming", Icon: Calendar },
                        { label: "Categories", view: "events", Icon: Tag },
                        { label: "Broadway Tickets", view: "broadway-tickets", Icon: Star },
                      ].map(({ label, view, Icon }) => (
                        <button
                          key={view}
                          onClick={() => handleNav(view)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                            currentView === view
                              ? "text-brand-blue bg-sky-50"
                              : "text-neutral-600 hover:text-brand-blue hover:bg-sky-50/50"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {[
                  { label: "Contact Us", view: "contact" },
                  { label: "About Us", view: "about" },
                ].map(({ label, view }) => (
                  <button
                    key={view}
                    onClick={() => handleNav(view)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-base font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                      currentView === view
                        ? "bg-sky-50 text-brand-blue"
                        : "text-neutral-800 hover:bg-neutral-50 hover:text-brand-blue"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post an Event — always visible in mobile drawer */}
            <div className="px-6 pb-4">
              <Link
                href="/organiser/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="relative flex items-center justify-center gap-2 w-full text-white font-black uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-lg shadow-purple-500/30 overflow-hidden group transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #00aeef, #ec4899)" }}
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                <Sparkles className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10">Post an Event</span>
              </Link>
            </div>

            {/* Bottom Actions — only shown when an organizer is logged in */}
            {isLoggedIn && (
              <div className="border-t border-neutral-100 px-6 py-6 space-y-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-blue to-purple-400 flex items-center justify-center shadow-md shadow-brand-blue/20">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-dark-text">{userProfile.name}</div>
                    <div className="text-[10px] text-neutral-400">{userProfile.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNav("profile")}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                    currentView === "profile"
                      ? "bg-sky-50 border-brand-blue/30 text-brand-blue"
                      : "border-neutral-200 text-neutral-700 hover:border-brand-blue/30 hover:text-brand-blue"
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Profile Settings
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black py-2.5 rounded-xl border border-red-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
