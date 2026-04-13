import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold border-l-[3px] border-l-primary pl-4 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm mt-1 pl-[19px]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
