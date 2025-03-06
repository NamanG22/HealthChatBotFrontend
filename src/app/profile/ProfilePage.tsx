import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage(){
    return(
        <div className="relative flex h-full flex-grow flex-nowrap overflow-hidden">
            <main className="z-main-section flex flex-grow lg:min-w-0 absolute h-full w-full lg:static lg:h-auto transition-transform duration-500 ease-in-out lg:transition-none">
                <section className="relative flex h-full min-w-0 flex-grow flex-col rounded-lg border border-marble-400 bg-marble-100 overflow-hidden">
                    <div className="flex h-full w-full flex-col">
                        <div className="flex m-4 w-1/2 mx-auto rounded outline-1 outline-offset-4 outline-volcanic-700">
                            <div className="grid w-1/2 place-content-center">
                                <FaUserCircle className="h-36 w-36 m-4 text-volcanic-700"/>
                            </div>
                            <div className="flex flex-col w-1/2 my-auto">
                                <p className="text-volcanic-900">
                                    Name:               
                                </p>
                                <p className="text-volcanic-900">
                                    Email: 
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}