"use client";

import React, {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";

type ChildWithClickProps = {
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-expanded"?: boolean;
};

type ChildWithClick = ReactElement<ChildWithClickProps>;

function withClick(
  child: ReactNode,
  handler: MouseEventHandler<HTMLElement>,
  extra?: Partial<ChildWithClickProps>
) {
  if (!isValidElement(child)) return child;
  const element = child as ChildWithClick;
  const original = element.props.onClick;
  return cloneElement(element, {
    ...extra,
    onClick: (event) => {
      original?.(event);
      if (!event.defaultPrevented) handler(event);
    },
  });
}

interface OpenContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<OpenContextValue | null>(null);

function DialogRoot({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogPortal({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function DialogOverlay(props: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(DialogContext);
  if (!context?.open) return null;
  return (
    <div
      {...props}
      data-state="open"
      onMouseDown={(event) => {
        props.onMouseDown?.(event);
        if (!event.defaultPrevented) context.setOpen(false);
      }}
    />
  );
}

function DialogContent(props: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(DialogContext);
  if (!context?.open) return null;
  return <div role="dialog" aria-modal="true" {...props} data-state="open" />;
}

function DialogTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} />;
}

function DialogDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}

function DialogClose({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: ReactNode;
}) {
  const context = useContext(DialogContext);
  if (asChild) {
    return withClick(children, () => context?.setOpen(false)) as ReactElement;
  }
  return (
    <button type="button" onClick={() => context?.setOpen(false)}>
      {children}
    </button>
  );
}

const AlertContext = createContext<OpenContextValue | null>(null);

function AlertRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <AlertContext.Provider value={{ open, setOpen }}>{children}</AlertContext.Provider>;
}

function AlertTrigger({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const context = useContext(AlertContext);
  if (asChild) return withClick(children, () => context?.setOpen(true)) as ReactElement;
  return <button type="button" onClick={() => context?.setOpen(true)}>{children}</button>;
}

function AlertPortal({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function AlertOverlay(props: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(AlertContext);
  if (!context?.open) return null;
  return <div {...props} data-state="open" />;
}

function AlertContent(props: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(AlertContext);
  if (!context?.open) return null;
  return <div role="alertdialog" aria-modal="true" {...props} data-state="open" />;
}

function AlertTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} />;
}

function AlertDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} />;
}

function AlertCancel({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const context = useContext(AlertContext);
  if (asChild) return withClick(children, () => context?.setOpen(false)) as ReactElement;
  return <button type="button" onClick={() => context?.setOpen(false)}>{children}</button>;
}

function AlertAction({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const context = useContext(AlertContext);
  if (asChild) return withClick(children, () => context?.setOpen(false)) as ReactElement;
  return <button type="button" onClick={() => context?.setOpen(false)}>{children}</button>;
}

const PopoverContext = createContext<OpenContextValue | null>(null);

function PopoverRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  const context = useContext(PopoverContext);
  if (asChild) {
    return withClick(
      children,
      () => context?.setOpen(!context.open),
      { "aria-expanded": context?.open ?? false }
    ) as ReactElement;
  }
  return <button type="button" onClick={() => context?.setOpen(!context.open)}>{children}</button>;
}

function PopoverPortal({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function PopoverContent({
  align: _align,
  sideOffset: _sideOffset,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: string; sideOffset?: number }) {
  const context = useContext(PopoverContext);
  if (!context?.open) return null;
  return (
    <div
      {...props}
      data-state="open"
      className={className}
      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", ...style }}
    />
  );
}

function PopoverArrow({ className }: { className?: string }) {
  return <span aria-hidden="true" className={className} />;
}

interface SwitchRootProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SwitchContext = createContext(false);

function SwitchRoot({ checked, onCheckedChange, children, ...props }: SwitchRootProps) {
  return (
    <SwitchContext.Provider value={checked}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        {children}
      </button>
    </SwitchContext.Provider>
  );
}

function SwitchThumb(props: HTMLAttributes<HTMLSpanElement>) {
  const checked = useContext(SwitchContext);
  return <span {...props} data-state={checked ? "checked" : "unchecked"} />;
}

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function TabsRoot({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList(props: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" {...props} />;
}

function TabsTrigger({
  value,
  children,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(TabsContext);
  const active = context?.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context?.setValue(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export const AlertDialog = {
  Root: AlertRoot,
  Trigger: AlertTrigger,
  Portal: AlertPortal,
  Overlay: AlertOverlay,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Cancel: AlertCancel,
  Action: AlertAction,
};

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
};

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
};

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
};
