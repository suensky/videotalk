import React from "react";
import { HashRouter as Router, Route, } from "react-router-dom";
import Samples from "./Samples";
import Camera from './Camera';
import Canvas from './Canvas';
import ScreenSharing from './ScreenSharing'

class App extends React.Component {
    render() {
        return <Router>
            <div>
                <Route exact path="/" component={Samples} />
                <Route exact path="/camera" component={Camera} />
                <Route exact path="/canvas" component={Canvas} />
                <Route exact path="/screensharing" component={ScreenSharing} />
            </div>
        </Router>
    }
}

export default App;