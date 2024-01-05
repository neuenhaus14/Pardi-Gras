import React, { useEffect, useRef, useState, useContext } from 'react';
import { Map, Marker, NavigationControl, GeolocateControl, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
// This map displays in the Create Modal for either
// creating a new event or editing an existing event that
// is owned by the user. You must own the
// event to edit it.

interface EventCreateMapComponentProps {
  eventLatitude: number,
  eventLongitude: number,
  isNewEvent: boolean,
  userLatitude: number,
  userLongitude: number,
  setEventLongitude: any,
  setEventLatitude: any,
  setEventAddress: any,
  setIsEventUpdated: any,
  eventType: string,
}

const EventCreateMapComponent: React.FC<EventCreateMapComponentProps> = ({ isNewEvent, eventLatitude, eventLongitude, userLatitude, userLongitude, setEventLatitude, setEventLongitude, setEventAddress, setIsEventUpdated, eventType }) => {

  const markerClicked = () => {
    window.alert('the marker was clicked');
  };

  const mapRef = useRef(null);


  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();

  useEffect(() => {
    // this useEffect runs whenever
    // isNewEvent switches; isNewEvent defaults
    // to false whenever a modal closes
    if (isNewEvent && eventType === 'user'){
      console.log('about to trigger. isNewEvent', isNewEvent)
      setTimeout(()=>{
        geoControlRef.current?.trigger();
      }, 200)
    }
  }, [geoControlRef.current, isNewEvent]);

  useEffect(()=>{
   console.log('eventLat or eventLong CHANGED')
    mapRef.current?.flyTo({ center: [eventLongitude, eventLatitude] });
  }, [eventLatitude, eventLongitude])


  const [viewState, setViewState] = useState({
    // lat and long default to zero, so new events will not have lat/long
    latitude: eventLatitude > 0 ? eventLatitude : userLatitude,
    longitude: eventLongitude > 0 ? eventLongitude : userLongitude,
    zoom: 12,
  });

  const dropPin = async (e: any) => {
    const { lat, lng } = e.lngLat
    setEventLatitude(lat);
    setEventLongitude(lng);

    const eventAddressResponse = await axios.post('/api/events/getAddressFromCoordinates', {
      coordinates : {
        latitude: lat,
        longitude: lng
      }
    });
    console.log(eventAddressResponse);
    const eventAddress = eventAddressResponse.data;
    setIsEventUpdated(true);
    setEventAddress(eventAddress)
  }

  console.log('bottom of eCMapComponent. eventType', eventType)
  return (
    <div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', width: '100%', height: '25vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={dropPin}
      >

        { // conditional render for pin if we're editing the event
        // or have placed an address
        (eventLatitude !== 0 && eventLongitude !== 0) &&
        <Marker onClick={() => markerClicked()} longitude={eventLongitude} latitude={eventLatitude} anchor="bottom"></Marker>
        }

        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          showUserLocation={true}
          showAccuracyCircle={false}
          ref={geoControlRef}
          />
      </Map>
    </div>
  )
}

export default EventCreateMapComponent;