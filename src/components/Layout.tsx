import Header from './Header';
import Main from './Main';


const Layout = () => {
  return (
    <div id="__next">
      <div className="flex h-screen w-full flex-1 flex-col bg-mushroom-100 px-3 md:p-3">
        <div className="flex h-full w-full flex-grow flex-col gap-3 py-3 md:flex-grow md:p-0">
          <Header/>
          <Main/>
        </div>
      </div> 
    </div>
  );
};

export default Layout;
