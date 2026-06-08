"use client";

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// 1. Calendar / Find Event Icon: A glowing radar calendar sheet with spark particles
export function FindEventIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="find-event-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="find-event-spark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      {/* Radar pulse background circle */}
      <circle cx="16" cy="8" r="4" stroke="#00AEEF" strokeWidth="1" strokeDasharray="3 2" className="animate-pulse" opacity="0.6" />
      
      {/* Calendar Card Sheet */}
      <rect x="3" y="6" width="14" height="14" rx="3" fill="url(#find-event-grad)" stroke="currentColor" strokeWidth="2" />
      
      {/* Calendar Binder Rings */}
      <path d="M7 4v3M13 4v3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 11h14" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Calendar Grid Cells */}
      <rect x="6" y="14" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
      <rect x="10" y="14" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
      
      {/* Highlighted Event/Star marker */}
      <path
        d="M17.5 13.5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3z"
        fill="url(#find-event-spark)"
        stroke="#00AEEF"
        strokeWidth="0.75"
        className="animate-bounce"
        style={{ transformOrigin: "17.5px 15.5px", animationDuration: "2.5s" }}
      />
    </svg>
  );
}

// 2. Pay Safely Icon: A 3D floating credit card overlayed with a secure lock shield
export function PaySafelyIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:rotate-[3deg] group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#0096CF" />
        </linearGradient>
      </defs>

      {/* Tilted credit card */}
      <g transform="rotate(-6 12 12)">
        <rect
          x="2"
          y="6"
          width="18"
          height="12"
          rx="2.5"
          fill="url(#card-grad)"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        {/* Magnetic stripe / card line */}
        <line x1="2" y1="9.5" x2="20" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
        {/* Smart chip marker */}
        <rect x="4.5" y="12" width="3" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
      </g>

      {/* Floating secure shield badge on top-right */}
      <g className="translate-x-[4px] translate-y-[-2px]">
        <path
          d="M17 11.5v2.5c0 2-1.5 3.5-3 4-1.5-.5-3-2-3-4v-2.5l3-1.5 3 1.5z"
          fill="url(#shield-grad)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          className="drop-shadow-[0_2px_4px_rgba(0,174,239,0.3)]"
        />
        {/* Small checkmark inside shield */}
        <path
          d="M12.5 14l1 1 2-2"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// 3. Show Phone Icon: Futuristic smartphone mockup showing ticket scan laser
export function ShowPhoneIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="phone-screen-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Phone Body */}
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="3"
        fill="url(#phone-screen-grad)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Top speaker notch */}
      <line x1="10" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Digital barcode layout */}
      <g transform="translate(8, 8)" stroke="currentColor" strokeWidth="1.5">
        <line x1="1" y1="0" x2="1" y2="6" />
        <line x1="3" y1="0" x2="3" y2="6" strokeWidth="0.75" />
        <line x1="5" y1="0" x2="5" y2="6" strokeWidth="2" />
        <line x1="7" y1="0" x2="7" y2="6" />
        <line x1="9" y1="0" x2="9" y2="6" strokeWidth="0.75" />
      </g>

      {/* QR scanner target points */}
      <rect x="8" y="16" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <rect x="13" y="16" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />

      {/* Red/Cyan glowing laser bar */}
      <line
        x1="5"
        y1="11"
        x2="19"
        y2="11"
        stroke="#00AEEF"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-pulse"
        style={{ animationDuration: "1.2s" }}
      />
      
      {/* Home button circle */}
      <circle cx="12" cy="20" r="0.75" fill="currentColor" />
    </svg>
  );
}

// 4. Sign Up Icon: A digital processor/chip nodes circuit glowing with cyan
export function SignUpIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="chip-center-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6F8FF" />
        </linearGradient>
      </defs>

      {/* Processor base */}
      <rect x="5" y="5" width="14" height="14" rx="2" fill="url(#chip-center-grad)" stroke="currentColor" strokeWidth="2" />
      
      {/* Circuit tracks */}
      <path d="M9 1H9M15 1H15M9 23H9M15 23H15M1 9H1M1 15H1M23 9H23M23 15H23" stroke="#00AEEF" strokeWidth="2" />
      <path d="M9 5V3M15 5V3M9 19v2M15 19v2M5 9H3M5 15H3M19 9h2M19 15h2" stroke="currentColor" strokeWidth="1.5" />

      {/* Inner verification user icon */}
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 16c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// 5. Add Event Icon: A dynamic calendar sheet with sparkling dots and a plus indicator
export function AddEventIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="add-evt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="plus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Calendar Base */}
      <rect
        x="3"
        y="4"
        width="14"
        height="15"
        rx="2.5"
        fill="url(#add-evt-grad)"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="6.5" r="0.75" fill="currentColor" />
      <circle cx="13.5" cy="6.5" r="0.75" fill="currentColor" />

      {/* Sparkling particle dots */}
      <circle cx="20" cy="5" r="1" fill="#00AEEF" className="animate-ping" style={{ animationDuration: "1.8s" }} />
      <circle cx="21" cy="11" r="1.5" fill="#00AEEF" opacity="0.7" />

      {/* Plus badge on bottom-right */}
      <g transform="translate(13, 13)">
        <circle
          cx="4"
          cy="4"
          r="4.5"
          fill="url(#plus-grad)"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          className="drop-shadow-[0_2px_4px_rgba(0,174,239,0.35)]"
        />
        <line x1="4" y1="2" x2="4" y2="6" stroke="#FFFFFF" strokeWidth="1.25" strokeLinecap="round" />
        <line x1="2" y1="4" x2="6" y2="4" stroke="#FFFFFF" strokeWidth="1.25" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 6. Get Paid Icon: A security shield enclosing floating financial waves
export function GetPaidIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="paid-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="paid-waves" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Outer shield structure */}
      <path
        d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z"
        fill="url(#paid-shield-grad)"
        stroke="currentColor"
        strokeWidth="1.75"
      />

      {/* Dollar Coin inside */}
      <circle cx="12" cy="11.5" r="4" fill="url(#paid-waves)" stroke="#FFFFFF" strokeWidth="1" className="animate-pulse" style={{ animationDuration: "2s" }} />
      <text
        x="12"
        y="14"
        fontFamily="sans-serif"
        fontSize="7.5"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        $
      </text>

      {/* Transaction arrow loops */}
      <path
        d="M6 14.5c.5 1.5 2 2.5 4 2.5M18 14.5c-.5 1.5-2 2.5-4 2.5"
        stroke="#00AEEF"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

// 7. Real Tickets Icon: Double-ringed security badge with checkmarks
export function RealTicketsIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="badge-outer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="badge-inner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#0096CF" />
        </linearGradient>
      </defs>

      {/* Outer concentric rotating dash ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 3"
        opacity="0.35"
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Holographic Shield Base */}
      <path
        d="M12 4.5L6 6.5v5c0 4.2 2.5 7.8 6 8.5 3.5-.7 6-4.3 6-8.5v-5l-6-2z"
        fill="url(#badge-outer)"
        stroke="currentColor"
        strokeWidth="1.75"
      />

      {/* Core verified shield badge */}
      <path
        d="M12 7.5l-3.5 1.2v3.3c0 2.6 1.5 4.8 3.5 5.5 2-.7 3.5-2.9 3.5-5.5V8.7L12 7.5z"
        fill="url(#badge-inner)"
        stroke="#FFFFFF"
        strokeWidth="1.25"
      />

      {/* Inside checkmark */}
      <path
        d="M10.5 12l1 1 2-2"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 8. Buy Fast Icon: Speedometer dial with instant lightning charge indicator
export function BuyFastIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="speed-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#0096CF" />
        </linearGradient>
      </defs>

      {/* Speedometer dial outline */}
      <path
        d="M4.5 17.5A8.5 8.5 0 1 1 19.5 17.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M4.5 17.5A8.5 8.5 0 0 1 16 5.5"
        stroke="url(#speed-grad)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />

      {/* Dashboard ticks */}
      <line x1="12" y1="3.5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="5.5" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="18.5" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />

      {/* Speed Needle */}
      <line
        x1="12"
        y1="12"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="origin-[12px_12px] hover:rotate-[15deg] transition-transform duration-300"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />

      {/* Flash lightning indicator */}
      <path
        d="M11 12.5l2-3.5h-2.5l1.5-3.5"
        stroke="#00AEEF"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
        style={{ animationDuration: "1s" }}
      />
    </svg>
  );
}

// 9. All Tickets Icon: Stack of three floating digital pass cards
export function AllTicketsIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="ticket-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="ticket-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Back Ticket */}
      <rect
        x="6"
        y="3"
        width="12"
        height="15"
        rx="2"
        transform="rotate(-12 12 10.5)"
        fill="url(#ticket-grad-1)"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.5"
      />

      {/* Middle Ticket */}
      <rect
        x="6"
        y="3"
        width="12"
        height="15"
        rx="2"
        transform="rotate(6 12 10.5)"
        fill="url(#ticket-grad-1)"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.8"
      />

      {/* Front Ticket */}
      <g transform="translate(4, 5)">
        <rect
          x="0"
          y="0"
          width="13"
          height="16"
          rx="2"
          fill="url(#ticket-grad-2)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          className="drop-shadow-[0_4px_8px_rgba(0,174,239,0.3)]"
        />
        {/* Ticket punch circles */}
        <circle cx="0" cy="8" r="1.5" fill="#00AEEF" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="13" cy="8" r="1.5" fill="#00AEEF" stroke="#FFFFFF" strokeWidth="1" />
        {/* Mini barcode lines on front ticket */}
        <line x1="3" y1="12" x2="10" y2="12" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 1" />
        <circle cx="6.5" cy="5" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

// 10. Host Event Icon: Central glowing stage node with connecting user orbits
export function HostEventIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="host-center" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6F8FF" />
        </linearGradient>
      </defs>

      {/* Connecting orbits */}
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1" opacity="0.2" />

      {/* Orbiting client nodes */}
      <circle cx="6" cy="6" r="1.5" fill="#00AEEF" className="animate-ping" style={{ animationDuration: "3s" }} />
      <circle cx="6" cy="6" r="1.5" fill="#00AEEF" />
      <circle cx="18" cy="18" r="1.5" fill="#00AEEF" />
      <circle cx="18" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="18" r="2" fill="currentColor" />

      {/* Central Host Star Node */}
      <path
        d="M12 7.5l1.2 2.7 2.8.4-2 2 1 2.9-3-1.5-3 1.5 1-2.9-2-2 2.8-.4z"
        fill="url(#host-center)"
        stroke="#00AEEF"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 11. Honest Prices Icon: Official looking award stamp with zero surprise fee stars
export function HonestPricesIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="award-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="award-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Hanging Ribbons */}
      <path d="M8 12.5v7l4-2.5 4 2.5v-7" fill="url(#award-ribbon)" stroke="currentColor" strokeWidth="1" />

      {/* Outer scalloped certificate outline */}
      <circle
        cx="12"
        cy="10"
        r="7.5"
        fill="url(#award-body)"
        stroke="currentColor"
        strokeWidth="1.75"
        className="drop-shadow-[0_2px_4px_rgba(0,174,239,0.2)]"
      />

      {/* Inner circular border */}
      <circle cx="12" cy="10" r="5.25" stroke="#00AEEF" strokeWidth="1" strokeDasharray="1.5 1.5" />

      {/* Sparkles details */}
      <path
        d="M12 7v6M9 10h6"
        stroke="#00AEEF"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="animate-pulse"
      />
    </svg>
  );
}

// 12. Bank Connect Icon: Stylized classical bank columns wrapped in orbit waves
export function BankConnectIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-all duration-300 group-hover:scale-110`}
      {...props}
    >
      <defs>
        <linearGradient id="bank-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E6F8FF" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Stylized banking columns shape */}
      <rect x="2" y="18" width="20" height="2.5" rx="0.5" fill="currentColor" opacity="0.8" />
      <rect x="3" y="16.5" width="18" height="1.5" fill="currentColor" opacity="0.6" />
      
      {/* 3 Pillars */}
      <rect x="5.5" y="7.5" width="2" height="9" rx="0.25" fill="url(#bank-body-grad)" stroke="currentColor" strokeWidth="1.25" />
      <rect x="11" y="7.5" width="2" height="9" rx="0.25" fill="url(#bank-body-grad)" stroke="currentColor" strokeWidth="1.25" />
      <rect x="16.5" y="7.5" width="2" height="9" rx="0.25" fill="url(#bank-body-grad)" stroke="currentColor" strokeWidth="1.25" />

      {/* Triangular Roof Pediment */}
      <polygon points="12,2.5 2,7.5 22,7.5" fill="url(#bank-body-grad)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Orbiting transaction particles */}
      <path
        d="M2 13s5-3 10-3 10 3 10 3"
        stroke="#00AEEF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
        className="animate-pulse"
      />
    </svg>
  );
}

// 13. Loader Ticket Icon: Rotating and pulsing golden-blue ticket badge for welcome loader
export function LoaderTicketIcon({ className = "h-8 w-8", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={`${className}`}
      {...props}
    >
      <defs>
        <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="loader-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Glowing outer shadow ring */}
      <circle cx="16" cy="16" r="15" stroke="url(#loader-grad)" strokeWidth="1.5" opacity="0.3" filter="url(#loader-glow)" />

      {/* Outer rotating ticket borders */}
      <g className="origin-[16px_16px] animate-[spin_8s_linear_infinite]" style={{ transformOrigin: "16px 16px" }}>
        <path
          d="M6 10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3.5a1.5 1.5 0 0 0 0 3v3.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3.5a1.5 1.5 0 0 0 0-3V10z"
          stroke="url(#loader-grad)"
          strokeWidth="2.5"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />
        {/* Ticket perforation line */}
        <line x1="21" y1="8.5" x2="21" y2="23.5" stroke="url(#loader-grad)" strokeWidth="1.5" strokeDasharray="3 2" />
        
        {/* Sparkle emblem on card */}
        <path
          d="M13.5 12l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"
          fill="url(#loader-grad)"
        />
      </g>

      {/* Centered pulsing ticket icon */}
      <path
        d="M21 16h-4"
        stroke="url(#loader-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-pulse"
      />
    </svg>
  );
}
