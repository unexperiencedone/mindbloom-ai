import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

type CrisisAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CrisisAlert({ open, onOpenChange }: CrisisAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-6 w-6" />
            An Important Message
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-foreground/90 space-y-4 pt-4">
              <p>
                It sounds like you are in a lot of pain, and I'm deeply
                concerned. Please know that immediate help is available and you
                are not alone.
              </p>
              <p className="font-semibold">
                Please connect with a professional in India right now:
              </p>
              <ul className="list-none space-y-2 rounded-lg border bg-secondary/50 p-4">
                <li className="font-medium">
                  <strong>iCALL Psychosocial Helpline:</strong>
                  <br />
                  <a href="tel:9152987821" className="text-primary underline">9152987821</a>
                </li>
                <li className="font-medium">
                  <strong>Vandrevala Foundation:</strong>
                  <br />
                  <a href="tel:9999666555" className="text-primary underline">9999666555</a>
                </li>
                <li className="font-medium">
                  <strong>AASRA (24x7 Helpline):</strong>
                  <br />
                  <a href="tel:+919820466726" className="text-primary underline">+91-9820466726</a>
                </li>
              </ul>
              <p>
                Reaching out is a sign of strength. They are trained to support
                you.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
