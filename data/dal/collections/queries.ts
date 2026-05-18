import { prisma } from "@/lib/prisma"

export const getCollections = async (userId: string) => {
    try {
        const collections = await prisma.collection.findMany({
            where: {
                AND: {
                    ownerId: userId,
                    view: "PUBLIC"
                }
            },
            include: {
                user: {
                    select: {
                        
                    }
                },
                posts: {
                    
                }
            }
        })
    } catch (error) {
        
    }
}