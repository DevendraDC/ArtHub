type Session = {
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    };
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        role: string;
        profileCreated: boolean;
        username?: string | null | undefined;
    };
} | null

export function sessionDTO(session: Session) {
  return {
    userId: session?.user.id,
    name: session?.user.name,
    username: session?.user.username,
    image: session?.user.image,
    profileCreated: session?.user.profileCreated,
    email: session?.user.email
  };
}

export type UserSession = Awaited<ReturnType<typeof sessionDTO>>;

