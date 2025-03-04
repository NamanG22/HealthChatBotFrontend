export default function HomePage(){
    return(
        <div className="relative flex h-full flex-grow flex-nowrap overflow-hidden">
            <main className="z-main-section flex flex-grow lg:min-w-0 absolute h-full w-full lg:static lg:h-auto transition-transform duration-500 ease-in-out lg:transition-none">
                <section className="relative flex h-full min-w-0 flex-grow flex-col rounded-lg border border-marble-400 bg-marble-100 overflow-hidden">
                    <div className="flex h-full w-full flex-col"></div>
                </section>
            </main>
        </div>
    )
}