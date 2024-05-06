import React from 'react';
import { xml2js } from 'xml-js';
import { useState, useEffect } from 'react';
import "./prikaz.css"; 

function debugImageBase64(base64URL){
  var win = window.open();
  win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

function debugVideoBase64(base64URL) {
  var win = window.open();
  win.document.write('<video controls style="width:100%; height:auto;"><source src="' + base64URL  + '" type="video/mp4"></video>');
}

function DisplayFormData() {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    fetchData(); 
  }, []); 

  const fetchData = () => {
    fetch('http://localhost:5000/formData.xml') 
      .then(response => response.text()) 
      .then(xmlData => {
        const jsonData = xml2js(xmlData, { compact: true }); 
        const forms = jsonData.forms?.form || []; 
        setFormData(forms); 
      })
      .catch(error => console.error('Greška pri dohvaćanju podataka:', error));
  };

  return (
    <div>
      <h2>Podaci iz XML datoteke:</h2>
      <table className="formDataTable">
        <thead>
          <tr>
            <th>Ime aplikacije</th>
            <th>Ostalo ime aplikacije</th>
            <th>Mjesto aplikacije</th>
            <th>Ostalo mjesto aplikacije</th>
            <th>Opis problema</th>
            <th>Mediji</th>
            <th>Vrsta uređaja</th>
            <th>Vrsta internetskog preglednika</th>
            <th>Model uređaja</th>
            <th>Verzija operacijskog sustava</th>
            <th>E-adresa</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(formData) ? (
          formData.map((form, index) => (
            <tr key={index}>
              <td>{form.appName?._text}</td>
              <td>{form.customAppName?._text}</td>
              <td>{form.location?._text}</td>
              <td>{form.customLocation?._text}</td>
              <td className="description-cell">{form.description?._text}</td>
              <td className="media-cell">
              {form.media && (
                Array.isArray(form.media) ? ( 
                  form.media.map((mediaItem, index) => (
                    <div key={index}>
                      {mediaItem.type && mediaItem.data && mediaItem.name && ( 
                      <div>
                        {mediaItem.type._text.startsWith('image') ? ( 
                        <div>
                          <img
                            src={`data:${mediaItem.type._text};base64,${mediaItem.data._text}`}
                            alt={mediaItem.name._text}
                            className="image-container"
                          />
                          <button onClick={() => debugImageBase64(`data:${mediaItem.type._text};base64,${mediaItem.data._text}`)}>
                            Prikaži u novom prozoru
                          </button>
                        </div>
                        ) : mediaItem.type._text.startsWith('video') ? (
                        <div>
                          <video controls className="video-container">
                            <source src={`data:${mediaItem.type._text};base64,${mediaItem.data._text}`} type={mediaItem.type._text} />
                          </video>
                          <button onClick={() => debugVideoBase64(`data:${mediaItem.type._text};base64,${mediaItem.data._text}`)}>
                            Prikaži u novom prozoru
                          </button>
                        </div>
                      ) : (
                        <p>{mediaItem.name._text}</p>
                      )}
                      </div>
                    )}
                    </div>
                  ))
                ) : (
                <div>
                {form.media.type && form.media.data && form.media.name && ( 
                  <div>
                    {form.media.type._text.startsWith('image') ? ( 
                    <div>
                      <img
                        src={`data:${form.media.type._text};base64,${form.media.data._text}`}
                        alt={form.media.name._text}
                        className="image-container"
                      />
                      <button onClick={() => debugImageBase64(`data:${form.media.type._text};base64,${form.media.data._text}`)}>
                        Prikaži u novom prozoru
                      </button>
                    </div>
                  ) : form.media.type._text.startsWith('video') ? (
                  <div>
                    <video controls className="video-container">
                      <source src={`data:${form.media.type._text};base64,${form.media.data._text}`} type={form.media.type._text} />
                    </video>
                    <button onClick={() => debugVideoBase64(`data:${form.media.type._text};base64,${form.media.data._text}`)}>
                      Prikaži u novom prozoru
                    </button>
                  </div>
                  ) : (
                    <p>{form.media.name._text}</p>
                  )}
                  </div>
                )}
                </div>
                )
              )}
              </td>
              <td>{form.deviceType?._text}</td>
              <td>{form.browserType?._text}</td>
              <td>{form.deviceModel?._text}</td>
              <td>{form.osType?._text}</td>
              <td>{form.email?._text}</td>
            </tr>
          ))
        ) : (
          <tr>
              <td>{formData.appName?._text}</td>
              <td>{formData.customAppName?._text}</td>
              <td>{formData.location?._text}</td>
              <td>{formData.customLocation?._text}</td>
              <td className="description-cell">{formData.description?._text}</td>
              <td className="media-cell">
              {formData.media && (
                Array.isArray(formData.media) ? ( 
                  formData.media.map((mediaItem, index) => (
                    <div key={index}>
                      {mediaItem.type && mediaItem.data && mediaItem.name && ( 
                      <div>
                        {mediaItem.type._text.startsWith('image') ? ( 
                        <div>
                          <img
                            src={`data:${mediaItem.type._text};base64,${mediaItem.data._text}`}
                            alt={mediaItem.name._text}
                            className="image-container"
                          />
                          <button onClick={() => debugImageBase64(`data:${mediaItem.type._text};base64,${mediaItem.data._text}`)}>
                            Prikaži u novom prozoru
                          </button>
                        </div>
                        ) : mediaItem.type._text.startsWith('video') ? (
                        <div>
                          <video controls className="video-container">
                            <source src={`data:${mediaItem.type._text};base64,${mediaItem.data._text}`} type={mediaItem.type._text} />
                          </video>
                          <button onClick={() => debugVideoBase64(`data:${mediaItem.type._text};base64,${mediaItem.data._text}`)}>
                          Prikaži u novom prozoru
                          </button>
                        </div>
                      ) : (
                        <p>{mediaItem.name._text}</p>
                      )}
                      </div>
                    )}
                    </div>
                  ))
                ) : (
                <div>
                {formData.media.type && formData.media.data && formData.media.name && ( 
                  <div>
                    {formData.media.type._text.startsWith('image') ? ( 
                    <div>
                      <img
                        src={`data:${formData.media.type._text};base64,${formData.media.data._text}`}
                        alt={formData.media.name._text}
                        className="image-container"
                      />
                      <button onClick={() => debugImageBase64(`data:${formData.media.type._text};base64,${formData.media.data._text}`)}>
                      Prikaži u novom prozoru
                      </button>
                    </div>
                  ) : formData.media.type._text.startsWith('video') ? (
                  <div>
                    <video controls className="video-container">
                      <source src={`data:${formData.media.type._text};base64,${formData.media.data._text}`} type={formData.media.type._text} />
                    </video>
                    <button onClick={() => debugVideoBase64(`data:${formData.media.type._text};base64,${formData.media.data._text}`)}>
                      Prikaži u novom prozoru
                    </button>
                  </div>
                  ) : (
                    <p>{formData.media.name._text}</p>
                  )}
                  </div>
                )}
                </div>
              )
              )}
              </td>
              <td>{formData.deviceType?._text}</td>
              <td>{formData.browserType?._text}</td>
              <td>{formData.deviceModel?._text}</td>
              <td>{formData.osType?._text}</td>
              <td>{formData.email?._text}</td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayFormData; 