import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Rascunho", className: "bg-secondary text-muted-foreground" },
  generated: { label: "Gerada", className: "bg-success-bg text-success" },
  sent: { label: "Enviada", className: "bg-sidebar-accent text-primary" },
  approved: { label: "Aprovada", className: "bg-success-bg text-success" },
  rejected: { label: "Rejeitada", className: "bg-destructive/20 text-destructive" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium rounded-md px-2.5 py-1",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "generated", label: "Gerada" },
  { value: "sent", label: "Enviada" },
  { value: "approved", label: "Aprovada" },
  { value: "rejected", label: "Rejeitada" },
];
