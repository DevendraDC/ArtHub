import PostModal from "./postModal";
import PostFetch from "./postFetch";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params

    return (
        <PostModal>
            <PostFetch postId={id} />
        </PostModal>
    )
}