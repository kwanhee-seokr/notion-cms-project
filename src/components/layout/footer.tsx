import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium">{SITE_CONFIG.NAME}</p>
          <p className="text-muted-foreground text-xs">{SITE_CONFIG.SLOGAN}</p>
          <a
            href={SITE_CONFIG.STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs hover:underline"
          >
            네이버 스마트스토어 바로가기
          </a>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.NAME}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
