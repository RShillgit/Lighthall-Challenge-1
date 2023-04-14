import './App.css';
import { useEffect, useState } from 'react';
import useGeolocation from "react-hook-geolocation";
import Geocode from "react-geocode";

function App() {

  const geolocation = useGeolocation();
  Geocode.setApiKey(process.env.REACT_APP_API_KEY);

  const [userLocation, setUserLocation] = useState();
  const [allLocations, setAllLocations] = useState();
  const [clickCount, setClickCount] = useState(0);
  const [currentUserClicks, setCurrentUserClicks] = useState(0);

  // On mount 
  useEffect(() => {

    // Fetch all locations and click count from db
    // https://lighthall-challenge-1-production.up.railway.app/
    fetch('http://localhost:8000', {
      headers: {"Content-Type": "application/json"},
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      
      // Get the total number of clicks by adding each locations clicks value
      let totalClicks = 0;
      data.allStates.forEach(state => {
        totalClicks = totalClicks + state.clicks;
      })
      setClickCount(totalClicks);

      setAllLocations(data.allStates);
    })
    .catch(err => console.log(err))
  }, [])

  // On mount/geolocation change
  useEffect(() => {

    // If latitude and longitude exist
    if(geolocation.latitude && geolocation.longitude) {
     
      // Get the state where the user is located
      Geocode.fromLatLng(geolocation.latitude, geolocation.longitude).then(
        (response) => {
          let state;
          for (let i = 0; i < response.results[0].address_components.length; i++) {
            for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
              switch (response.results[0].address_components[i].types[j]) {
                case "administrative_area_level_1":
                  state = response.results[0].address_components[i].long_name;
                  break;
              }
            }
          }
          setUserLocation(state)
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [geolocation])

  const handleUserClick = () => {

    // Check the allLocations array for the user's state
    const stateExists = allLocations.find(location => location.name === userLocation);

    // If the state exists, incriment its count and update allLoctions
    if (stateExists) {

      const newClicks = stateExists.clicks + 1;

      setAllLocations([...allLocations].map(location => {
        if(location.name === userLocation) {
          return {
            ...location,
            clicks: newClicks
          }
        }
        else return location;
      }))

      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        mode: 'cors',
        body: JSON.stringify({location: userLocation, clicks: newClicks})
      })
      .catch(err => console.log(err))
    }

    // User's state does not exist yet
    else {
      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        mode: 'cors',
        body: JSON.stringify({location: userLocation, clicks: currentUserClicks + 1})
      })
      .then(res => res.json())
      .then(data => {
        // If it was successful
        if (data.success) {
          setAllLocations(data.allStates);
        }
      })
      .catch(err => console.log(err))
    }

    // Incriment the current user's clicks
    setCurrentUserClicks(currentUserClicks + 1);

    // Incriment the total clicks
    setClickCount(clickCount + 1);
  }

  return (
    <div className="App">

      {(allLocations && userLocation) 
        ?
        <>
          <header>
            <h1>Challenge 1: Chasing the Clicks</h1>
          </header>

          <div className="totalClicks-container">
            <div className='totalClicks-main'>
              <p>Count: {clickCount}</p>
              <div className='totalClicks-actions'>
                <button onClick={handleUserClick} id='incrimentButton'>Incriment Count</button>
              </div>
            </div>
            <div className='locations'>
              {allLocations.map(location => {
                return(
                  <div className='individualLocation' key={location._id}>
                    <p>{location.name}:</p>
                    <p>{location.clicks}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
        :
        <div className='loadingPage'>
            <h1>Loading...</h1>
        </div>
      }
    </div>
  );
}

export default App;
