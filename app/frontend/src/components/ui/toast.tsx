import * as React from 'react';

type ToastProps = React.ComponentPropsWithoutRef<'div'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ToastActionElement = React.ReactElement;

export type { ToastProps, ToastActionElement };
