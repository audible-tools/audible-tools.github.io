import React from 'react';
import ChecksumResolver from './ChecksumResolver';
import ReactNotification from 'react-notifications-component'

const App = () => {
    return (
        <div>
            <div style={{display:'flex'}}>
            <ReactNotification />

            </div>

            <ChecksumResolver />
        </div>
    );
}
export default App;
