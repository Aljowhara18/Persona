import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-paper/10 bg-void/95 sticky top-0 z-50 backdrop-blur">
      <Link to="/" className="text-right leading-none">
        <div className="font-poster text-3xl md:text-4xl tracking-wide text-paper">
          أرشيف / الشخصيات
        </div>
        <div className="text-[10px] tracking-[0.4em] text-mustard uppercase mt-1">
          PERSONA · ARCHIVE
        </div>
      </Link>

      <nav className="flex items-center gap-3">
        <Link
          to="/quiz"
          className="rounded-sm bg-mustard text-void px-5 py-2.5 text-sm font-bold hover:bg-paper transition-colors"
        >
          اكتشفي شخصيتك
        </Link>
        <Link
          to="/"
          className="rounded-sm border border-paper/25 text-paper px-5 py-2.5 text-sm hover:border-mustard hover:text-mustard transition-colors"
        >
          الأرشيف
        </Link>
      </nav>
    </header>
  );
}
