import LeftPanel from './LeftPanel';
import Chat from './Chat';
export default function Main(){
    return(
        <div className="relative flex h-full flex-grow flex-nowrap overflow-hidden">
            <LeftPanel/>
            <Chat/>
            <div data-component="ConfigurationDrawer" data-source-file="ConfigurationDrawer.tsx"></div>
        </div>
    )
}