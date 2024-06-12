import Footer from "./Footer"
import MovableInputBox from "./MoveableComponent"
import Header from "./Header"
function App() {

  return (
    <>
      <div className="font-dona">
        <Header/>
        <MovableInputBox />
        <div><Footer/></div>
        {/* <Footer /> */}
        
      </div>
    </>
  )
}

export default App
