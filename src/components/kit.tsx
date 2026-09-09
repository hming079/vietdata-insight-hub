import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Circle,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Status } from "@/lib/mock-data";

/* --------------------------------- Status --------------------------------- */

const statusStyles: Record<Status, { cls: string; Icon: LucideIcon }> = {
  success: { cls: "bg-success/10 text-success border-success/25", Icon: CheckCircle2 },
  warning: { cls: "bg-warning/15 text-warning-foreground border-warning/35", Icon: AlertTriangle },
  error: { cls: "bg-destructive/10 text-destructive border-destructive/25", Icon: XCircle },
  processing: { cls: "bg-info/10 text-info border-info/25", Icon: Loader2 },
  neutral: { cls: "bg-muted text-muted-foreground border-border", Icon: Circle },
};

export function StatusPill({
  status,
  children,
  className,
}: {
  status: Status;
  children: ReactNode;
  className?: string;
}) {
  const { cls, Icon } = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        cls,
        className,
      )}
    >
      <Icon className={cn("size-3.5", status === "processing" && "animate-spin")} />
      {children}
    </span>
  );
}

export function Dot({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-destructive",
    processing: "bg-info animate-pulse",
    neutral: "bg-muted-foreground",
  };
  return <span className={cn("inline-block size-2 rounded-full", map[status])} />;
}

/* ------------------------------- Page header ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------------------------- Panel --------------------------------- */

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel flex flex-col overflow-hidden", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cn("flex-1", bodyClassName ?? "p-5")}>{children}</div>
    </section>
  );
}

/* --------------------------------- Metric --------------------------------- */

export function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-numeric",
        up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
      )}
    >
      {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

/* ------------------------------- Empty state ------------------------------ */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------- SQL viewer ------------------------------- */

const KEYWORDS =
  /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|JOIN|LEFT JOIN|INNER JOIN|ON|AND|OR|AS|LIMIT|SUM|COUNT|AVG|MAX|MIN|DISTINCT|DATE_TRUNC|INTERVAL|NOT|NULL|CASE|WHEN|THEN|ELSE|END|HAVING|BETWEEN|IN|DESC|ASC)\b/g;

export function SqlCode({ code, className }: { code: string; className?: string }) {
  const lines = code.split("\n");
  return (
    <pre
      className={cn(
        "scrollbar-slim overflow-x-auto bg-code-bg p-4 font-mono text-[12.5px] leading-6 text-code-foreground",
        className,
      )}
    >
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 w-5 shrink-0 text-right text-code-comment select-none">
              {i + 1}
            </span>
            <span className="whitespace-pre">{highlight(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}

function highlight(line: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  let rest = line;
  let key = 0;

  // strings
  const parts = rest.split(/('[^']*')/g);
  parts.forEach((part) => {
    if (/^'.*'$/.test(part)) {
      tokens.push(
        <span key={key++} className="text-code-string">
          {part}
        </span>,
      );
      return;
    }
    let last = 0;
    part.replace(KEYWORDS, (match, _g, offset: number) => {
      if (offset > last) tokens.push(<span key={key++}>{part.slice(last, offset)}</span>);
      tokens.push(
        <span key={key++} className="font-medium text-code-keyword">
          {match}
        </span>,
      );
      last = offset + match.length;
      return match;
    });
    if (last < part.length) {
      const tail = part.slice(last);
      const numSplit = tail.split(/(\b\d+\b)/g);
      numSplit.forEach((t) =>
        /^\d+$/.test(t)
          ? tokens.push(
              <span key={key++} className="text-code-number">
                {t}
              </span>,
            )
          : tokens.push(<span key={key++}>{t}</span>),
      );
    }
  });
  return tokens;
}
