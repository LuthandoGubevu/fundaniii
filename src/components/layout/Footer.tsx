
export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Fundanii Tales. All rights reserved.
        </p>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
          Empowering African Learners.
        </p>
      </div>
    </footer>
  );
}
