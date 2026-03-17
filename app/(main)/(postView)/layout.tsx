export default function PagesLayout(
    {
        children,
        modal
    }: {
        children: React.ReactNode;
        modal: React.ReactNode;
    }
) {
    return (
        <>
            {modal}
            {children}
        </>
    )
}