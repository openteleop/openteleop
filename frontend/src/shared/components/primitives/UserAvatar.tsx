import { useMemo } from "react";
import { User } from "@shared/types/global/user";
import { SizeProp } from "@shared/types/size";
import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@shared/helpers/tailwind";

const sizeClasses: Record<SizeProp, string> = {
  xs: "h-rx-5 w-rx-5 text-1 rounded-item",
  sm: "h-rx-6 w-rx-6 text-2 rounded-item",
  md: "h-rx-7 w-rx-7 text-4 rounded-item",
  lg: "h-rx-8 w-rx-8 text-6 rounded-item",
  xl: "h-rx-9 w-rx-9 text-7 rounded-item",
};

interface UserAvatarProps {
  user: User;
  size?: SizeProp;
}

const getAvatarFallback = (user: User) => {
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`;
  return initials;
};

const UserAvatar = ({ user, size = "md" }: UserAvatarProps) => {
  const fallbackString = useMemo(() => getAvatarFallback(user), [user]);
  return (
    <Avatar.Root className={cn("relative flex shrink-0 overflow-hidden", sizeClasses[size])}>
      <Avatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={user.avatar_url}
        alt={`${user.first_name} ${user.last_name} avatar`}
      />
      <Avatar.Fallback delayMs={0} className="flex w-full items-center justify-center rounded-[inherit] bg-gray-3 font-medium text-gray-11">
        {fallbackString}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export default UserAvatar;
