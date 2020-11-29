import React, { useEffect, useState } from "react";
import "./App.css";
const webSocket = new WebSocket("ws://0.0.0.0:8080/orders");

function App() {
  const [orders, setOrders] = useState([]);

  function approveNext() {
    webSocket.send("approve");
  }

  function updateOrders(event) {
    const data = JSON.parse(event.data);
    if (data.orders) {
      setOrders(data.orders);
    } else {
      const actual = orders.find((o) => o.id === data.id);
      if (actual) {
        setOrders((os) =>
          os.map((o) => {
            if (o.id == data.id) {
              return {...o, ready: true};
            }
            return o;
          })
        );
      } else {
        setOrders([...orders, data]);
      }
    }
  }

  useEffect(() => {
    webSocket.onclose = () => {
      console.log("Socket connection closed.");
    };
  }, []);

  useEffect(() => {
    webSocket.onmessage = updateOrders;
  }, [orders]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Check Orders</h2>
        <p style={{ fontSize: "14px" }}>
          Press on the button to approve the next order.
        </p>
        <button className="approve-button" onClick={approveNext}>
          Approve
        </button>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          <div className="container">
            {orders
              .sort((a, b) => (a.id <= b.id ? 1 : -1)).filter(o => o.ready)
              .map((o) => {
                return (
                  <div className="order-container">
                    <div>{o.id.toString()}</div>
                    <div style={{ color: o.ready ? "white" : "#4c5464" }}>
                      {"Approved"}
                    </div>
                    <div className={o.ready ? "approve" : " reject"}></div>
                  </div>
                );
              })}
          </div>
          <div className="container">
            {orders
              .sort((a, b) => (a.id <= b.id ? 1 : -1)).filter(o => !o.ready)
              .map((o) => {
                return (
                  <div className="order-container">
                    <div>{o.id.toString()}</div>
                    <div style={{ color: o.ready ? "white" : "#4c5464" }}>
                      {"Pending"}
                    </div>
                    <div className={o.ready ? "approve" : " reject"}></div>
                  </div>
                );
              })}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
