/*require('globals');

function testFunc() {
  try {
    var uuids = java.util.UUID.fromString("fa87c0d0-afac-11de-8a39-0800200c9a66");
    var mBluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();
    var tmp = mBluetoothAdapter.listenUsingInsecureRfcommWithServiceRecord("grab", uuids);
    var socOutStr = null;
    var socInpStr = null;
    let socket = null;
    // Keep listening until exception occurs or a socket is returned.
    while (true) {
      try {
        console.log("SERVER STARTED WAITING ....................");
        socket = tmp.accept();
        console.log("SERVER STARTED ACCEPTING ....................");
      } catch (exception) {
        console.log("SERVER.JS EXCEPTION 1");
        console.log(exception);
        alert("Unable to accept connections");
        break;
      }

      if (socket != null) {
        // A connection was accepted. Perform work associated with
        // the connection in a separate thread.
        //    manageMyConnectedSocket(socket);
          //  tmp.close();
           // break;
        //   socInpStr = socket.getInputStream();
        socOutStr = socket.getOutputStream();
        console.log("A connection was accepted");
        tmp.close();
        var data = [];
        let td = "sk" + "Test Message Now Deepak";
        data = unpack(td);
        socOutStr.write(data);
        postMessage(socket);
        testFunc();
        //  break;
      }
    }
  } catch (exception) {
    console.log(exception);
    alert("Unable to start server socket");
  }

}

function unpack(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);

    bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
  }
  return bytes;
}

testFunc();*/