import React, { useState, useEffect, useRef } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

function App() {
  const [urls, setUrls] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const file = useRef("");

  useEffect(() => {
    fetch("http://localhost:4000/short")
      .then((res) => res.json())
      .then((res) => {
        setUrls(res);
      });
  }, [loading]);

  const handleChange = (e) => setUrl(e.target.value);

  const handleClick = (e) => {
    setLoading(true);
    console.log(file.current.files[0]);
    if (file.current.files[0] !== undefined) {

      const data = new FormData()

      data.append('urls', file.current.files[0])

      fetch("http://localhost:4000/save-masive-by-file", {
        method: "POST",
        body: data
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          setLoading(false)
          window.location.reload()
        }).catch(e => console.log(e))

    } else {
      console.log("sin file");
      const headers = {
        "Content-Type": "application/json",
      };

      fetch("http://localhost:4000/save-short-url", {
        method: "POST",
        headers,
        body: JSON.stringify({ original: url }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.error) {
            alert(res.error);
          }
          setLoading(false);
          setUrl("");
          renderTable();
        })
        .catch((e) => console.log(e));
    }
  };

  const renderTable = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>URL original</th>
          <th>URL acortada</th>
        </tr>
      </thead>
      <tbody>
        {urls.map((url) => (
          <tr key={url.id}>
            <td>{url.id}</td>
            <td>{url.original}</td>
            <td>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`http://localhost:4000/${url.short}`}
              >
                {`http://localhost:4000/${url.short}`}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div className="App">
      <Jumbotron>
        <h1>Acortador de URL's!</h1>
        <p>
          Cliente construído en React usando <code>react-bootstrap</code> para
          agregar y mostrar urls acortadas
        </p>
      </Jumbotron>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <Form
              onSubmit={(e) => e.preventDefault()}
              encType="multipart/form-data"
            >
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Archivo de texto">
                  <br />
                  <Form.File
                    id="custom-file"
                    label="Custom file input"
                    custom
                    ref={file}
                  />
                  <br />
                </Tab>
                <Tab eventKey="profile" title="Formulario">
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Ingrese la URL que desea acortar</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter URL"
                      onChange={handleChange}
                      value={url}
                    />
                    <Form.Text className="text-muted">
                      Recuerde ingresar una URL válida.
                    </Form.Text>
                  </Form.Group>
                </Tab>
              </Tabs>
              <Button onClick={handleClick} variant="primary" type="submit">
                Enviar
              </Button>
            </Form>
          </div>
          <div className="col-md-8">{renderTable()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
