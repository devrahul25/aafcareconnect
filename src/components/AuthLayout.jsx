import React from "react";

export default function AuthLayout({ title, subtitle = undefined, footer = undefined, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-[440px]">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 relative">
          
          {/* Logo Circle */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center p-3">
              <img src="/logo.png" alt="AafCareConnect Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[26px] font-bold leading-tight text-slate-900 mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
          </div>

          {children}
        </div>

        {/* Footer outside the card (optional) */}
        {footer && (
          <p className="text-center text-sm font-medium text-slate-500 mt-8">{footer}</p>
        )}
      </div>
    </div>
  );
}