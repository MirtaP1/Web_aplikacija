import React from "react";
import "./forma.css"; 
import logo from "./logo_ict_aac.png";
import { useState } from "react";
import hrFlag from "./croatia.png";
import enFlag  from "./england.png";
import { useRef } from "react";

function MyForm() {
  const [appName, setAppName] = useState("");
  const [customAppName, setCustomAppName] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState(""); 
  const [osType, setOsType] = useState("");
  const [browserType, setBrowserType] = useState("");
  const [email, setEmail] = useState("");
  const [, setIsValid] = useState(true);
  const [language, setLanguage] = useState("hr");
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const hiddenFileInput = useRef(null);
  const [error, setError] = useState(null);
  const [helper, setHelper] = useState("");
  
  const alerts = {
    hr: {
      validEmail: "Unesite valjanu e-mail adresu.",
      networkError: "Došlo je do pogreške prilikom slanja podataka na server.",
      success: "Podaci uspješno poslani na server.",
      invalidFile: "Nedopuštena datoteka: {fileName}. Molimo odaberite datoteke s ekstenzijama: jpg, jpeg, png, gif, mp4, avi, mov, wmv.",
      oversizedVideo: "Veličina videa {fileName} prelazi maksimalno dopuštenih {maxVideoSize} MB.",
      maxFilesExceeded: "Možete odabrati maksimalno 5 datoteka."
    },
    en: {
      validEmail: "Enter a valid email address.",
      networkError: "There was an error sending the data to the server.",
      success: "Data successfully sent to the server.",
      invalidFile: "Invalid file: {fileName}. Please choose files with extensions: jpg, jpeg, png, gif, mp4, avi, mov, wmv.",
      oversizedVideo: "The size of the video {fileName} exceeds the maximum allowed {maxVideoSize} MB.",
      maxFilesExceeded: "You can select a maximum of 5 files."
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mediaData = await addMediaToXml(media);
  
    const formData = {
      appName,
      customAppName: (appName === "Ostalo" || appName === "Other") ? customAppName : null, 
      location,
      customLocation: (location === "Ostalo" || location === "Other") ? customLocation : null, 
      description,
      
      media: mediaData,
      deviceType,
      deviceModel,
      osType,
      browserType,
      email
    };

    const jsonData = JSON.stringify({ form: formData });

    try {
      const response = await fetch('http://localhost:5000/formData.xml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert(alerts[language].success);
    } catch (error) {
      console.error('There was an error sending the data:', error);
      alert(alerts[language].networkError);
    }

    event.target.reset();
    setMedia([]);
    window.location.reload();
  };

  const handleLanguageChange = (selectedLanguage) => {
    setAppName("");
    setCustomAppName("");
    setLocation("");
    setCustomLocation("");
    setDescription("");
    setMedia([]);
    setDeviceType("");
    setBrowserType("");
    setDeviceModel("");
    setOsType("");
    setEmail("");
    setHelper("");

    setLanguage(selectedLanguage);
  };
  
  const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const addMediaToXml = async (files) => {
    const mediaData = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = await fileToBase64(file);
      mediaData.push({ name: file.name, type: file.type, data: base64Data });
    }
    return mediaData;
  };
  
  const handleAppChange = (event) => {
    setAppName(event.target.value);
  };
  
  const handleCustomAppNameChange = (event) => { 
    setCustomAppName(event.target.value);
  };
  
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  
  const handleCustomLocationChange = (event) => {
    setCustomLocation(event.target.value);
  };
  
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    handleMediaChange(event);
  };

  const showError = (errorMessage, duration = 5000) => {
    setError(errorMessage);
    setTimeout(() => {
        setError(null);
    }, duration);
  };
  
  const MAX_VIDEO_SIZE_MB = 20;
  
  const handleMediaChange = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);
  
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      const extension = file.name.split('.').pop().toLowerCase(); 
        
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'mp4', 'avi', 'mov', 'wmv'];
        
      if (!allowedExtensions.includes(extension)) {
        showError(alerts[language].invalidFile.replace("{fileName}", file.name));
        return;
      }
  
      if (file.type.includes('video') && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        showError(alerts[language].oversizedVideo.replace("{fileName}", file.name).replace("{maxVideoSize}", MAX_VIDEO_SIZE_MB));
        return;
      }
    }
      
    if (filesArray.length + media.length > 5) {
      showError(alerts[language].maxFilesExceeded);
      return;
    }
    showError(null);
    setMedia(prevMedia => [...prevMedia, ...filesArray]); 
  };
  
  const handleRemoveMedia = (index) => {
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index)); 
  };

  const handleInputValidation = (event) => {
    setDeviceType(event.target.value);
    setHelper(event.target.value);
    
    const input = document.getElementById("helper");
    input.setCustomValidity('');
  };

  const handleDeviceTypeChange = (event) => {
    setDeviceType(event.target.value);
    setHelper(event.target.value);
  };

  const handleDeviceModelChange = (event) => {
    setDeviceModel(event.target.value);
  };
  
  const handleOsTypeChange = (event) => {
    setOsType(event.target.value);
  };
  
  const handleBrowserTypeChange = (event) => {
    setBrowserType(event.target.value);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValid(isValidEmail(newEmail));
  
    if (!isValidEmail(newEmail)) {
      event.target.setCustomValidity(language === 'hr' ? 'Molimo unesite ispravnu e-adresu.' : 'Please enter a valid email address.');
    } else {
      event.target.setCustomValidity('');
    }
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleInfoClick = () => {
    setShowForm(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowForm(true);
  };
  
  return (
    <div>
      <div className="info-button">
        <button onClick={handleInfoClick}>Info</button>
      </div>
      <div className="language-selection">
        <img
          src={hrFlag}
          alt="HR Flag"
          className={language === 'hr' ? 'flag active' : 'flag'}
          onClick={() => handleLanguageChange('hr')}
        />
        <img
          src={enFlag}
          alt="EN Flag"
          className={language === 'en' ? 'flag active' : 'flag'}
          onClick={() => handleLanguageChange('en')}
        />
      </div>
      {showForm && (
      <form onSubmit={handleSubmit}>
      {language === 'hr' && (
        <div>
          <div className="logo-title-container">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="form-title">Prijava grešaka u ICT-AAC aplikacijama</h1>
          </div>
          <br /><br /> 
          <label className="label-text">Ime aplikacije u kojoj ste uočili grešku: <span className="required">*</span></label>
          <select className="select-text"
            value={appName} 
            onChange={handleAppChange} 
            required
            onInvalid={(e) => e.target.setCustomValidity('Molimo odaberite ime aplikacije u kojoj ste uočili grešku.')}
            onInput={(e) => e.target.setCustomValidity('')}>
            <option value="">Odaberite...</option>
            <option value="Ćiribu Ćiriglas">Ćiribu Ćiriglas</option>
            <option value="Čuj SVEmir!">Čuj SVEmir!</option>
            <option value="Domino Brojalica">Domino brojalica</option>
            <option value="Endo-učilica">Endo-učilica</option>
            <option value="e-Galerija">e-Galerija</option>
            <option value="e-Galerija Senior">e-Galerija Senior</option>
            <option value="Glaskalica">Glaskalica</option>
            <option value="Gibalica">Gibalica</option>
            <option value="HAKOM Kviz">HAKOM Kviz</option>
            <option value="Jezična gradilica">Jezična gradilica</option>
            <option value="Jezično-govorna vježbalica">Jezično-govorna vježbalica</option>
            <option value="Koliko je sati">Koliko je sati</option>
            <option value="Komunikacijski ključevi">Komunikacijski ključevi</option>
            <option value="Komunikator">Komunikator</option>
            <option value="Komunikator+">Komunikator+</option>
            <option value="KuhARica">KuhARica</option>
            <option value="Kuna">Kuna</option>
            <option value="Kvizaš">Kvizaš</option>
            <option value="Lozinka">Lozinka</option>
            <option value="Mala Glaskalica">Mala Glaskalica</option>
            <option value="Matematička igraonica">Matematička igraonica</option>
            <option value="Matematički vrtuljak">Matematički vrtuljak</option>
            <option value="Matematika">Matematika</option>
            <option value="Pamtilica">Pamtilica</option>
            <option value="Pisalica">Pisalica</option>
            <option value="Ponašalica">Ponašalica</option>
            <option value="Prepoznaj pojmove">Prepoznaj pojmove</option>
            <option value="Pričajmo slikama">Pričajmo slikama</option>
            <option value="Pristupačni web">Pristupačni web</option>
            <option value="Prskalice">Prskalice</option>
            <option value="Učimo boje">Učimo boje</option>
            <option value="Učimo čtati">Učimo čtati</option>
            <option value="Učimo mjere">Učimo mjere</option>
            <option value="Učimo prijedloge">Učimo prijedloge</option>
            <option value="Učimo riječi">Učimo riječi</option>
            <option value="Učimo slogove">Učimo slogove</option>
            <option value="Slovarica">Slovarica</option>
            <option value="Susretnica">Susretnica</option>
            <option value="Vizualni raspored">Vizualni raspored</option>
            <option value="Vremenski vrtuljak">Vremenski vrtuljak</option>
            <option value="Zanimalica">Zanimalica</option>
            <option value="Ostalo">Ostalo</option>
          </select>
          {appName === "Ostalo" && ( 
          <div>
            <label>Unesite ime aplikacije: <span className="required">*</span></label>
            <input 
              type="text" 
              value={customAppName} 
              onChange={handleCustomAppNameChange} 
              required 
              onInvalid={(e) => e.target.setCustomValidity('Molimo unesite ime aplikacije.')}
              onInput={(e) => e.target.setCustomValidity('')} />
          </div>
          )}
          <br /><br /> 
          <label className="label-text">U kojem dijelu aplikacije ste uočili grešku: <span className="required">*</span></label>
          <select className="select-text"
            value={location} 
            onChange={handleLocationChange} 
            required
            onInvalid={(e) => e.target.setCustomValidity('Molimo odaberite u kojem dijelu aplikacije ste uočili grešku.')}
            onInput={(e) => e.target.setCustomValidity('')}>
            <option value="">Odaberite...</option>
            <option value="U igri">U igri</option>
            <option value="U postavkama">U postavkama</option>
            <option value="Ostalo">Ostalo</option>
          </select>
          {location === "Ostalo" && (
          <div>
            <label className="label-text">Napišite u kojem dijelu aplikacije ste uočili grešku: <span className="required">*</span></label>
            <input
              type="text"
              value={customLocation}
              onChange={handleCustomLocationChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('Molimo unesite u kojem dijelu aplikacije ste uočili grešku.')}
              onInput={(e) => e.target.setCustomValidity('')} />
          </div>
          )}
          <br /><br /> 
          <div className="container">
          <label>Detaljno opišite prijavljenu grešku: <span className="required">*</span></label>
          <textarea 
            value={description} 
            onChange={handleDescriptionChange} 
            placeholder="Ovdje opišite pogrešku" 
            rows="4" 
            cols="50" 
            required
            onInvalid={(e) => e.target.setCustomValidity('Molimo opišite pogrešku.')}
            onInput={(e) => e.target.setCustomValidity('')} />
          </div>
          <br /><br /> 
          <label className="label-text-2">Ako ste u mogućnosti, napravite presliku ekrana s prikazanom greškom ili slikajte grešku ili snimite video, te uploadajte datoteku </label> 
          <label>(maksimalno 5 datoteka):</label>
          <button className="button-upload" onClick={handleClick}>
            Priloži datoteku
          </button>
          {error && <p className="error-message">{error}</p>}
          <input type="file" accept="image/*, video/*" onChange={handleChange} ref={hiddenFileInput}
            style={{ display: "none" }} multiple />
          <br />
          {media.length > 0 && (
          <div>
            <p>Uploadane datoteke:</p>
            <ul className='ime-datoteke'>
              {media.map((file, index) => (
                <li key={index}>
                  {file.name} {}
                  <button type="button" onClick={() => handleRemoveMedia(index)}>Ukloni</button> {}
                </li>
              ))}
            </ul>
          </div>
          )}
          <br /><br /> 
          <div className="title-container">
            <h1 className="form-title">Podaci o uređaju</h1>
            <h2 className="form-title-small">Unesite podatke o uređaju na kojem ste uočili grešku koju prijavljujete. Bez ovih podataka ponekad nismo u mogućnosti ispraviti greške.</h2>
          </div>
          <br /><br /> 
          <label>Odaberite vrstu uređaja: <span className="required">*</span></label>
          <div>
            <input 
              type="radio" 
              id="android" 
              name="deviceType" 
              value="Android" 
              checked={deviceType === "Android"} 
              onChange={handleDeviceTypeChange} 
              onInput={handleInputValidation}
              />
            <label htmlFor="android">Android</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="ios" 
              name="deviceType" 
              value="iOS" 
              checked={deviceType === "iOS"} 
              onChange={handleDeviceTypeChange} 
              onInput={handleInputValidation}
              />
            <label htmlFor="ios">iOS</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="web" 
              name="deviceType" 
              value="Web" 
              checked={deviceType === "Web"} 
              onChange={handleDeviceTypeChange} 
              onInput={handleInputValidation}
              />
            <label htmlFor="web">Web aplikacija</label>
          </div>
          <div className="helper-input">
            <input 
              type="text" 
              value={helper} 
              id="helper"
              className="helper-input"
              required 
              onInvalid={(e) => e.target.setCustomValidity('Molimo unesite model uređaja.')}
              />
          </div>
          {deviceType === "Web" && ( 
          <div>
            <label>Unesite vrstu internetskog preglednika: <span className="required">*</span></label>
            <input 
              type="text" 
              value={browserType} 
              onChange={handleBrowserTypeChange} 
              required 
              onInvalid={(e) => e.target.setCustomValidity('Molimo unesite vrstu internetskog preglednika.')}
              onInput={(e) => e.target.setCustomValidity('')} />
            <span className="example">Primjer unosa: Google Chrome, Mozilla Firefox, Safari,...</span>
          </div>
          )}
          <br /><br /> 
          <label>Unesite model uređaja: <span className="required">*</span></label>
          <input 
            type="text" 
            value={deviceModel} 
            onChange={handleDeviceModelChange} 
            required 
            onInvalid={(e) => e.target.setCustomValidity('Molimo unesite model uređaja.')}
            onInput={(e) => e.target.setCustomValidity('')} />
          <span className="example">Primjer unosa: Samsung Galaxy S21, iPhone 13 Pro, Samsung Galaxy Tab S7, MacBook Pro 2021, Dell XPS 15,...</span>
          <br /><br /> 
          <label>Unesite verziju operacijskog sustava: <span className="required">*</span></label>
          <input 
            type="text" 
            value={osType} 
            onChange={handleOsTypeChange} 
            required 
            onInvalid={(e) => e.target.setCustomValidity('Molimo unesite verziju operacijskog sustava.')}
            onInput={(e) => e.target.setCustomValidity('')} />
          <span className="example">Ovu informaciju pronađite na sljedeći način za Android uređaje: Postavke -&gt; O telefonu -&gt; Informacije o uređaju -&gt; Verzija sustava Android.</span>
          <span className="example">Za iOS uređaje postupak je sljedeći: Postavke -&gt; Općenito -&gt; Opis -&gt; Verzija softvera.</span>
          <span className="example">Za računala ili laptope postupak je sljedeći: Postavke -&gt; Sustav -&gt; O uređaju -&gt; Specifikacije uređaja.</span>
          <br />
          <span className="example">Primjer unosa: Android 11, iOS 15, Windows 10, Ubuntu 20.04 LTS,...</span>
          <br /><br />
          <label className="label-text">Unesite svoju e-adresu kako bismo vas mogli kontaktirati ako trebamo dodatne informacije:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            />
          <br /><br />
          <input type="submit" value="Pošalji" className="submit-button" />
        </div>
      )}
      {language === 'en' && (
        <div>
          <div className="logo-title-container">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
          <h1 className="form-title">Bug Report in ICT-AAC applications</h1>
        </div>
        <br /><br /> 
        <label className="label-text">Please enter the name of the application where you noticed the error: <span className="required">*</span></label>
        <select className="select-text" 
          value={appName} 
          onChange={handleAppChange} 
          required
          onInvalid={(e) => e.target.setCustomValidity('Please select the name of the application where you noticed the error.')}
          onInput={(e) => e.target.setCustomValidity('')}>
          <option value="">Please choose...</option>
          <option value="Behavior">Behavior</option>
          <option value="Communicator">Communicator</option>
          <option value="Communicator+">Communicator+</option>
          <option value="Communication Keys">Communication Keys</option>
          <option value="Domino Counter">Domino Counter</option>
          <option value="e-Gallery">e-Gallery</option>
          <option value="e-Gallery Senior">e-Gallery Senior</option>
          <option value="HAKOM Quiz">HAKOM Quiz</option>
          <option value="Language Builder">Language Builder</option>
          <option value="Learning Colors">Learning Colors</option>
          <option value="Learning Measures">Learning Measures</option>
          <option value="Learning Syllables">Learning Syllables</option>
          <option value="Learning to Read">Learning to Read</option>
          <option value="Learning Words">Learning Words</option>
          <option value="Letters">Letters</option>
          <option value="Let's Talk with Pictures">Let's Talk with Pictures</option>
          <option value="Little Vocals">Little Vocals</option>
          <option value="Mathematical Carousel">Mathematical Carousel</option>
          <option value="Mathematical Playground">Mathematical Playground</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Memory">Memory</option>
          <option value="Recognize Terms">Recognize Terms</option>
          <option value="Sprays">Sprays</option>
          <option value="Terms">Terms</option>
          <option value="Time Carousel">Time Carousel</option>
          <option value="Visual Schedule">Visual Schedule</option>
          <option value="Vocals">Vocals</option>
          <option value="What Time Is It">What Time Is It</option>
          <option value="Writing">Writing</option>
          <option value="Other">Other</option>
        </select>
        {appName === "Other" && ( 
          <div>
            <label className="label-text">Please write the name of the application: <span className="required">*</span></label>
            <input 
              type="text" 
              value={customAppName} 
              onChange={handleCustomAppNameChange} 
              required 
              onInvalid={(e) => e.target.setCustomValidity('Please enter the name of the application.')}
              onInput={(e) => e.target.setCustomValidity('')}/>
          </div>
        )}
        <br /><br /> 
        <label className="label-text">Where in the application did you notice the error: <span className="required">*</span></label>
        <select className="select-text" 
          value={location} 
          onChange={handleLocationChange} 
          required
          onInvalid={(e) => e.target.setCustomValidity('Please select where in the application you noticed the error.')}
          onInput={(e) => e.target.setCustomValidity('')}>
          <option value="">Please choose...</option>
          <option value="In the game">In the game</option>
          <option value="In the settings">In the settings</option>
          <option value="Other">Other</option>
        </select>
        {location === "Other" && (
          <div>
            <label className="label-text">Write in which part of the application you noticed the error: <span className="required">*</span></label>
            <input
              type="text"
              value={customLocation}
              onChange={handleCustomLocationChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('Please enter where in the application you noticed the error.')}
              onInput={(e) => e.target.setCustomValidity('')}/>
          </div>
        )}
        <br /><br /> 
        <div className="container">
        <label>Describe the reported error in detail: <span className="required">*</span></label>
        <textarea 
          value={description} 
          onChange={handleDescriptionChange} 
          placeholder="Please describe the error here" 
          rows="4" 
          cols="50" 
          required
          onInvalid={(e) => e.target.setCustomValidity('Please describe the error.')}
          onInput={(e) => e.target.setCustomValidity('')}/>
        </div>
        <br /><br /> 
        <label className="label-text">If possible, take a screenshot showing the error or take a photo or a video of the error, then upload the file</label>
        <br /> 
        <label>(maximum 5 files):</label>
        <button className="button-upload" onClick={handleClick}>
          Upload a file
        </button>
        {error && <p className="error-message">{error}</p>}
          <input type="file" accept="image/*, video/*" onChange={handleChange} ref={hiddenFileInput}
          style={{ display: "none" }} multiple />
        <br />
        {media.length > 0 && (
          <div>
            <p>Uploaded files:</p>
            <ul className='ime-datoteke'>
              {media.map((file, index) => (
                <li key={index}>
                  {file.name} {}
                  <button type="button" onClick={() => handleRemoveMedia(index)}>Remove</button> {}
                </li>
              ))}
            </ul>
          </div>
        )}
        <br /><br /> 
        <div className="title-container">
          <h1 className="form-title">Device Information</h1>
          <h2 className="form-title-small">Enter the details about the device on which you noticed the error you are reporting. Sometimes we need this information to fix the issues.</h2>
        </div>
        <br /><br /> 
        <label>Select the type of device: <span className="required">*</span></label>
        <div>
          <input 
            type="radio" 
            id="android" 
            name="deviceType" 
            value="Android" 
            checked={deviceType === "Android"} 
            onChange={handleDeviceTypeChange} 
            onInput={handleInputValidation}
            />
          <label htmlFor="android">Android</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="ios" 
            name="deviceType" 
            value="iOS" 
            checked={deviceType === "iOS"} 
            onChange={handleDeviceTypeChange} 
            onInput={handleInputValidation}
            />
          <label htmlFor="ios">iOS</label>
        </div>
        <div>
        <input 
          type="radio" 
          id="web" 
          name="deviceType" 
          value="Web" 
          checked={deviceType === "Web"} 
          onChange={handleDeviceTypeChange} 
          onInput={handleInputValidation}
          />
        <label htmlFor="web">Web application</label>
        </div>
        <div className="helper-input">
          <input 
            type="text" 
            value={helper} 
            id="helper"
            className="helper-input"
            required 
            onInvalid={(e) => e.target.setCustomValidity('Please enter the device model.')}
            />
        </div>
        {deviceType === "Web" && ( 
          <div>
            <label>Enter the type of web browser: <span className="required">*</span></label>
            <input 
              type="text" 
              value={browserType} 
              onChange={handleBrowserTypeChange} 
              required 
              onInvalid={(e) => e.target.setCustomValidity('Please enter the type of web browser.')}
              onInput={(e) => e.target.setCustomValidity('')}/>
            <span className="example">Example: Google Chrome, Mozilla Firefox, Safari,...</span>
          </div>
        )}
        <br /><br /> 
        <label>Enter the device model: <span className="required">*</span></label>
        <input 
          type="text" 
          value={deviceModel} 
          onChange={handleDeviceModelChange} 
          required 
          onInvalid={(e) => e.target.setCustomValidity('Please enter the device model.')}
          onInput={(e) => e.target.setCustomValidity('')}/>
        <span className="example">Example: Samsung Galaxy S21, iPhone 13 Pro, Samsung Galaxy Tab S7, MacBook Pro 2021, Dell XPS 15,...</span>
        <br /><br /> 
        <label>Enter the operating system version: <span className="required">*</span></label>
        <input 
          type="text" 
          value={osType} 
          onChange={handleOsTypeChange} 
          required 
          onInvalid={(e) => e.target.setCustomValidity('Please enter the operating system version.')}
          onInput={(e) => e.target.setCustomValidity('')}/>
        <span className="example">To find this information for Android devices, follow these steps: Settings -&gt; About phone -&gt; Software information -&gt; Android version.</span>
        <span className="example">For iOS devices, the process is as follows: Settings -&gt; General -&gt; About -&gt; Software Version.</span>
        <span className="example">For computers or laptops, the process is as follows: Settings -&gt; System -&gt; About device -&gt; Device specifications.</span>
        <br />
        <span className="example">Example: Android 11, iOS 15, Windows 10, Ubuntu 20.04 LTS,...</span>
        <br /><br />
        <label className="label-text">Please enter your email address so that we can contact you if we need additional information:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}/>
        <br /><br />
        <input type="submit" value="Submit" className="submit-button" />
        </div>
      )}
      </form>
      )}
      {showPopup && (
        <div className="popup">
          {language === "hr" ? (
          <p className="info-text">Web aplikacije je razvijena u okviru završnog rada: <br />Mirta Petrović, Web-aplikacija za praćenje korisničkih prijava neispravnosti temeljena na tehnologiji React. <br />Sveučilište u Zagrebu Fakultet elektrotehnike i računarstva, ak.godina 2023/2024. <br />Mentorica: prof. dr. sc. Željka Car <br />Asistentica: dr. sc. Matea Žilak</p>
          ) : (
          <p className="info-text">The web application was developed as part of the bachelor's degree: <br />Mirta Petrović, A web application for tracking user-detected failures based on React technology. <br />University of Zagreb Faculty of Electrical Engineering and Computing, academic year 2023/2024. <br />Mentor: Prof. Željka Car, Ph.D. <br />Assistant: Matea Žilak, Ph.D.</p>
          )}
          <button onClick={handleClosePopup}>{language === "hr" ? "Zatvori" : "Close"}</button>
        </div>
      )}
    </div>
  )
}

export default MyForm;