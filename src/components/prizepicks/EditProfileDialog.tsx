import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfile, type ProfileData } from "./ProfileContext";

export function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data, setData } = useProfile();
  const [form, setForm] = useState<ProfileData>(data);

  useEffect(() => {
    if (open) setForm(data);
  }, [open, data]);

  const update = (k: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fields: { key: keyof ProfileData; label: string }[] = [
    { key: "name", label: "Profile name" },
    { key: "joinDate", label: "Joined date" },
    { key: "balance", label: "Balance" },
    { key: "followers", label: "Followers" },
    { key: "following", label: "Following" },
    { key: "wins", label: "Wins" },
    { key: "totalWon", label: "Total won" },
    { key: "topWin", label: "Top win" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-surface text-foreground">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((f) => (
            <div key={f.key} className="grid gap-1">
              <Label htmlFor={f.key} className="text-xs text-muted-foreground">{f.label}</Label>
              <Input
                id={f.key}
                value={form[f.key]}
                onChange={(e) => {
                  update(f.key)(e);
                  setData({ ...form, [f.key]: e.target.value });
                }}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
