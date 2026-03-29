import { SessionType } from "@/src/utils/types/userTypes";

export function sessionDTO(session: SessionType) {
  return {
    userId: session?.user.id,
    name: session?.user.name,
    username: session?.user.username,
    image: session?.user.image,
  };
}
