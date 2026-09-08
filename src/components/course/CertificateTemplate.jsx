import React from "react";

export function formatCertDate(d) {
  if (!d) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return String(d);
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function CertificateTemplate({
  learnerName = "Jane Smith",
  courseTitle = "Safeguarding Children",
  organisationName = "CareConnect Demo Authority",
  organisationLogo = null,
  issueDate = null,
  level = "Advanced",
  category = "Mandatory",
  cpdHours = "2 Hours",
  certNumber = "AAF-ORG-2026-001245",
  issuerName = "Alex Carter",
  authorisedName = "R. Morgan",
  scale = 1,
  id = "printable-certificate"
}) {
  const formattedDate = formatCertDate(issueDate);
  const formattedDuration = typeof cpdHours === "number" ? `${cpdHours} ${cpdHours === 1 ? 'Hour' : 'Hours'}` : (cpdHours?.includes("Hour") ? cpdHours : `${cpdHours || '2'} Hours`);

  return (
    <div
      id={id}
      className="relative bg-[#FCFBF7] text-[#0A2540] overflow-hidden select-none font-serif shadow-2xl"
      style={{
        width: "1050px",
        height: "742px",
        minWidth: "1050px",
        minHeight: "742px",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
        boxSizing: "border-box"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600;1,700&display=swap');
      `}</style>

      {/* Decorative Botanical Watermarks */}
      <svg className="absolute -left-10 top-1/4 w-72 h-72 opacity-[0.035] pointer-events-none text-[#0A2540]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M40,100 C40,40 100,40 160,20 C140,80 140,140 80,160 C60,140 40,120 40,100 Z" />
        <path d="M10,80 C30,30 80,20 130,10 C110,60 100,110 50,130 C30,110 10,95 10,80 Z" />
      </svg>
      <svg className="absolute -right-10 top-1/4 w-72 h-72 opacity-[0.035] pointer-events-none text-[#0A2540] transform scale-x-[-1]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M40,100 C40,40 100,40 160,20 C140,80 140,140 80,160 C60,140 40,120 40,100 Z" />
        <path d="M10,80 C30,30 80,20 130,10 C110,60 100,110 50,130 C30,110 10,95 10,80 Z" />
      </svg>

      {/* Outer Navy Border with Ornate Geometry */}
      <div className="absolute inset-[14px] border-[2.5px] border-[#0A2540] pointer-events-none">
        {/* Inner Thin Gold Accent Border */}
        <div className="absolute inset-[4px] border-[1px] border-[#C5A059]/60 pointer-events-none" />
      </div>

      {/* Ornate Corner Elements (Top Left, Top Right, Bottom Left, Bottom Right) */}
      <svg className="absolute top-[10px] left-[10px] w-16 h-16 text-[#0A2540] pointer-events-none" viewBox="0 0 60 60" fill="none" stroke="currentColor">
        <path d="M4,30 L4,4 L30,4" strokeWidth="3" />
        <path d="M8,26 L8,8 L26,8" strokeWidth="1" stroke="#C5A059" />
        <circle cx="14" cy="14" r="3" fill="#C5A059" />
        <path d="M4,4 L14,14" strokeWidth="1.5" />
      </svg>

      <svg className="absolute top-[10px] right-[10px] w-16 h-16 text-[#0A2540] pointer-events-none transform scale-x-[-1]" viewBox="0 0 60 60" fill="none" stroke="currentColor">
        <path d="M4,30 L4,4 L30,4" strokeWidth="3" />
        <path d="M8,26 L8,8 L26,8" strokeWidth="1" stroke="#C5A059" />
        <circle cx="14" cy="14" r="3" fill="#C5A059" />
        <path d="M4,4 L14,14" strokeWidth="1.5" />
      </svg>

      <svg className="absolute bottom-[10px] left-[10px] w-16 h-16 text-[#0A2540] pointer-events-none transform scale-y-[-1]" viewBox="0 0 60 60" fill="none" stroke="currentColor">
        <path d="M4,30 L4,4 L30,4" strokeWidth="3" />
        <path d="M8,26 L8,8 L26,8" strokeWidth="1" stroke="#C5A059" />
        <circle cx="14" cy="14" r="3" fill="#C5A059" />
        <path d="M4,4 L14,14" strokeWidth="1.5" />
      </svg>

      <svg className="absolute bottom-[10px] right-[10px] w-16 h-16 text-[#0A2540] pointer-events-none transform scale-[-1]" viewBox="0 0 60 60" fill="none" stroke="currentColor">
        <path d="M4,30 L4,4 L30,4" strokeWidth="3" />
        <path d="M8,26 L8,8 L26,8" strokeWidth="1" stroke="#C5A059" />
        <circle cx="14" cy="14" r="3" fill="#C5A059" />
        <path d="M4,4 L14,14" strokeWidth="1.5" />
      </svg>

      {/* Bottom Corner Navy & Gold Ribbon Waves */}
      {/* Bottom Left Ribbon Wave */}
      <svg className="absolute bottom-[14px] left-[14px] w-48 h-32 pointer-events-none z-0" viewBox="0 0 200 130" fill="none">
        <path d="M0,130 Q40,60 120,45 Q160,38 200,0 L0,0 Z" fill="#0A2540" />
        <path d="M0,130 Q45,70 125,55 Q165,48 190,15" stroke="#D4AF37" strokeWidth="3" fill="none" />
        <path d="M0,130 Q30,85 90,75 Q130,70 170,35" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>

      {/* Bottom Right Ribbon Wave */}
      <svg className="absolute bottom-[14px] right-[14px] w-48 h-32 pointer-events-none z-0 transform scale-x-[-1]" viewBox="0 0 200 130" fill="none">
        <path d="M0,130 Q40,60 120,45 Q160,38 200,0 L0,0 Z" fill="#0A2540" />
        <path d="M0,130 Q45,70 125,55 Q165,48 190,15" stroke="#D4AF37" strokeWidth="3" fill="none" />
        <path d="M0,130 Q30,85 90,75 Q130,70 170,35" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>

      {/* Inner Certificate Content Container */}
      <div className="relative z-10 px-12 pt-7 pb-6 flex flex-col justify-between h-full box-sizing">
        
        {/* TOP HEADER ROW */}
        <div className="flex items-center justify-between gap-4">
          {/* Top Left: Organisation Logo Box */}
          <div className="w-[180px] h-[58px] flex items-center justify-center">
            {organisationLogo ? (
              <img
                src={organisationLogo}
                alt="Organisation Logo"
                className="max-h-[52px] max-w-[170px] object-contain"
              />
            ) : (
              <div className="border border-dashed border-[#A0AEC0] rounded-md px-3 py-1.5 flex flex-col items-center justify-center w-full h-full bg-white/40">
                <div className="flex items-center gap-1 text-[#4A5568] font-sans text-[11px] font-bold tracking-tight">
                  <svg className="w-3.5 h-3.5 text-[#718096]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M21 15l-5-5L5 21" strokeWidth="2" />
                  </svg>
                  [Organisation Logo]
                </div>
                <span className="text-[8px] font-sans uppercase tracking-widest text-[#718096] mt-0.5">
                  YOUR LOGO HERE
                </span>
              </div>
            )}
          </div>

          {/* Top Center: AAF CareConnect Platform Title */}
          <div className="flex-1 text-center">
            <h1
              className="text-[31px] font-bold text-[#0A2540] tracking-wide uppercase leading-none font-sans"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              AAF CareConnect<span className="text-[17px] align-top">™</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[1px] w-12 bg-[#C5A059]" />
              <p
                className="text-[11px] tracking-[0.22em] text-[#0A2540] font-sans font-medium"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Training & Compliance Platform
              </p>
              <span className="h-[1px] w-12 bg-[#C5A059]" />
            </div>
          </div>

          {/* Top Right: Learning Motto Block */}
          <div className="w-[180px] text-right font-sans">
            <div className="border-l-2 border-[#C5A059] pl-2.5 inline-block text-left">
              <p className="text-[9px] font-bold text-[#4A5568] tracking-[0.16em] uppercase leading-tight">
                LEARNING
              </p>
              <p className="text-[9px] font-bold text-[#4A5568] tracking-[0.16em] uppercase leading-tight">
                SUPPORTING
              </p>
              <p className="text-[9px] font-bold text-[#4A5568] tracking-[0.16em] uppercase leading-tight">
                SAFER TOMORROWS
              </p>
            </div>
            <p className="text-[7.5px] font-medium text-[#718096] tracking-[0.12em] uppercase mt-1">
              PEOPLE · PRACTICE · POSITIVE CHANGE
            </p>
          </div>
        </div>

        {/* MAIN CERTIFICATE TITLE & RECIPIENT */}
        <div className="text-center my-auto pt-1">
          {/* Certificate of Completion Header */}
          <h2
            className="text-[44px] text-[#0A2540] font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Certificate <span className="italic font-serif font-normal text-[41px]">of</span> Completion
          </h2>

          {/* Centered Botanical Gold Flourish Accent */}
          <div className="flex items-center justify-center gap-2 my-2">
            <svg className="w-24 h-4 text-[#C5A059]" viewBox="0 0 100 16" fill="currentColor">
              <path d="M50,8 C40,4 30,1 10,8 C30,10 40,12 50,8 Z" />
              <circle cx="50" cy="8" r="2.5" />
              <path d="M50,8 C60,4 70,1 90,8 C70,10 60,12 50,8 Z" />
            </svg>
          </div>

          {/* "This is to certify that" */}
          <p className="text-[14px] text-[#4A5568] italic font-serif">
            This is to certify that
          </p>

          {/* Learner Name (Large script/flowing italic calligraphy) */}
          <div className="inline-block relative my-1">
            <h3
              className="text-[48px] text-[#0A2540] font-normal leading-tight px-8"
              style={{ fontFamily: "'Playfair Display', 'Great Vibes', Georgia, serif", fontStyle: "italic" }}
            >
              {learnerName}
            </h3>
            <div className="w-full h-[1.5px] bg-[#C5A059]/80 mt-0.5" />
          </div>

          {/* "has successfully completed the training course" */}
          <p className="text-[13.5px] text-[#4A5568] font-serif mt-1">
            has successfully completed the training course
          </p>

          {/* Course Title */}
          <h4
            className="text-[28px] font-bold text-[#0A2540] tracking-tight mt-1 mb-0.5"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            {courseTitle}
          </h4>

          {/* Slogan with Gold Rules */}
          <div className="flex items-center justify-center gap-3 mt-1.5 mb-2">
            <span className="h-[1px] w-14 bg-[#C5A059]" />
            <p
              className="text-[9.5px] tracking-[0.25em] text-[#C5A059] font-sans font-bold uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              SAFER CHILDREN · BRIGHTER FUTURES
            </p>
            <span className="h-[1px] w-14 bg-[#C5A059]" />
          </div>

          {/* METADATA GRID BOX (2 rows x 3 columns) */}
          <div className="max-w-[780px] mx-auto border border-[#C5A059] rounded-xl px-4 py-2.5 bg-white/70 shadow-sm mt-2">
            <div className="grid grid-cols-3 divide-x divide-[#C5A059]/50 text-left font-sans text-[11px]">
              {/* Column 1: Organisation & Level */}
              <div className="px-4 space-y-1">
                <div>
                  <span className="text-[#718096] text-[10px] block font-medium">Organisation:</span>
                  <span className="font-bold text-[#0A2540] truncate block">{organisationName}</span>
                </div>
                <div className="pt-0.5">
                  <span className="text-[#718096] text-[10px] block font-medium">Level:</span>
                  <span className="font-bold text-[#0A2540] block">{level}</span>
                </div>
              </div>

              {/* Column 2: Date & CPD Duration */}
              <div className="px-4 space-y-1">
                <div>
                  <span className="text-[#718096] text-[10px] block font-medium">Date:</span>
                  <span className="font-bold text-[#0A2540] block">{formattedDate}</span>
                </div>
                <div className="pt-0.5">
                  <span className="text-[#718096] text-[10px] block font-medium">CPD Duration:</span>
                  <span className="font-bold text-[#0A2540] block">{formattedDuration}</span>
                </div>
              </div>

              {/* Column 3: Category & Certificate No */}
              <div className="px-4 space-y-1">
                <div>
                  <span className="text-[#718096] text-[10px] block font-medium">Category:</span>
                  <span className="font-bold text-[#0A2540] block">{category}</span>
                </div>
                <div className="pt-0.5">
                  <span className="text-[#718096] text-[10px] block font-medium">Certificate No.:</span>
                  <span className="font-bold text-[#0A2540] font-mono text-[10.5px] block">{certNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNATURES & GOLD EMBOSSED SEAL ROW */}
        <div className="grid grid-cols-3 items-end pt-2 pb-1 relative">
          
          {/* Left Signature: Alex Carter */}
          <div className="text-center font-sans">
            <p
              className="text-[26px] text-[#0A2540] italic mb-0.5 font-serif"
              style={{ fontFamily: "'Playfair Display', cursive, serif" }}
            >
              {issuerName}
            </p>
            <div className="w-44 h-[1px] bg-[#0A2540]/60 mx-auto mb-1" />
            <p className="text-[10px] text-[#718096] font-medium leading-tight">Issued by</p>
            <p className="text-[11.5px] text-[#0A2540] font-bold leading-tight font-sans">AAF CareConnect™</p>
          </div>

          {/* Center: Gold Embossed Seal */}
          <div className="flex justify-center -mt-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Starburst / Scalloped Gold Background */}
              <svg className="w-24 h-24 text-[#C5A059] filter drop-shadow-md" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="url(#goldGrad)" stroke="#B38728" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#FAF0CA" strokeWidth="1" strokeDasharray="2 2" />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBF5B7" />
                    <stop offset="25%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#AA771C" />
                    <stop offset="75%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#FDF0A6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Circular Text Around Seal */}
              <svg className="absolute inset-0 w-24 h-24" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="none" />
                <text className="text-[6.5px] font-sans font-bold uppercase tracking-[0.24em] fill-[#5B4012]">
                  <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                    TRAINING · MAKES A DIFFERENCE ·
                  </textPath>
                </text>
              </svg>

              {/* Center Emblem: Laurel Leaves */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-9 h-9 text-[#5B4012]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8 6 6 12 12 17C18 12 16 6 12 2Z" />
                  <path d="M12 17C10 14 7 11 4 10C5 14 8 18 12 21C16 18 19 14 20 10C17 11 14 14 12 17Z" opacity="0.85" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Signature: R. Morgan */}
          <div className="text-center font-sans">
            <p
              className="text-[26px] text-[#0A2540] italic mb-0.5 font-serif"
              style={{ fontFamily: "'Playfair Display', cursive, serif" }}
            >
              {authorisedName}
            </p>
            <div className="w-44 h-[1px] bg-[#0A2540]/60 mx-auto mb-1" />
            <p className="text-[10px] text-[#718096] font-medium leading-tight">Authorised by</p>
            <p className="text-[11.5px] text-[#0A2540] font-bold leading-tight font-sans">Training Lead</p>
          </div>
        </div>

        {/* BOTTOM VERIFICATION & FOOTER ROW */}
        <div className="flex items-end justify-between font-sans text-[10px] pt-1">
          {/* Bottom Left: QR Code & Verification */}
          <div className="flex items-center gap-2.5">
            {/* SVG Crisp QR Code */}
            <div className="w-10 h-10 bg-white p-1 rounded border border-slate-300 shadow-xs flex-shrink-0">
              <svg viewBox="0 0 25 25" className="w-full h-full text-[#0A2540]" fill="currentColor">
                <rect x="0" y="0" width="7" height="7" />
                <rect x="1" y="1" width="5" height="5" fill="white" />
                <rect x="2" y="2" width="3" height="3" />
                <rect x="18" y="0" width="7" height="7" />
                <rect x="19" y="1" width="5" height="5" fill="white" />
                <rect x="20" y="2" width="3" height="3" />
                <rect x="0" y="18" width="7" height="7" />
                <rect x="1" y="19" width="5" height="5" fill="white" />
                <rect x="2" y="20" width="3" height="3" />
                <rect x="9" y="2" width="2" height="2" />
                <rect x="13" y="2" width="3" height="2" />
                <rect x="9" y="6" width="3" height="2" />
                <rect x="2" y="10" width="3" height="2" />
                <rect x="6" y="13" width="2" height="3" />
                <rect x="10" y="10" width="5" height="5" />
                <rect x="11" y="11" width="3" height="3" fill="white" />
                <rect x="18" y="9" width="2" height="4" />
                <rect x="22" y="10" width="3" height="2" />
                <rect x="9" y="17" width="3" height="2" />
                <rect x="13" y="19" width="4" height="2" />
                <rect x="18" y="17" width="2" height="5" />
                <rect x="21" y="20" width="3" height="3" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#0A2540] text-[9.5px]">Certificate Verification</p>
              <p className="text-[#718096] text-[8.5px] font-mono">
                aafcareconnect.com/verify/{certNumber}
              </p>
            </div>
          </div>

          {/* Bottom Center: Motto */}
          <div className="text-center pb-0.5">
            <p className="text-[9px] font-bold tracking-[0.25em] text-[#718096] uppercase">
              LEARN · COMPLY · MAKE A DIFFERENCE
            </p>
          </div>

          {/* Bottom Right: Competent Carers */}
          <div className="text-right border-l-2 border-[#C5A059] pl-2 pb-0.5">
            <p className="text-[8.5px] font-bold text-[#4A5568] tracking-[0.15em] uppercase">
              COMPETENT CARERS
            </p>
            <p className="text-[8.5px] font-bold text-[#4A5568] tracking-[0.15em] uppercase">
              STRONGER COMMUNITIES
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
