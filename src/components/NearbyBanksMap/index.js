/*global google*/
import React, { Component } from 'react';
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { MAP } from "react-google-maps/lib/constants"

import styles from './styles.module.scss'

const PERSON_ICON = 'data:image/svg+xml,<svg%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20width%3D"23"%20height%3D"38"%20viewBox%3D"0%200%2023%2038">%0A<path%20d%3D"M16.6%2C38.1h-5.5l-0.2-2.9-0.2%2C2.9h-5.5L5%2C25.3l-0.8%2C2a1.53%2C1.53%2C0%2C0%2C1-1.9.9l-1.2-.4a1.58%2C1.58%2C0%2C0%2C1-1-1.9v-0.1c0.3-.9%2C3.1-11.2%2C3.1-11.2a2.66%2C2.66%2C0%2C0%2C1%2C2.3-2l0.6-.5a6.93%2C6.93%2C0%2C0%2C1%2C4.7-12%2C6.8%2C6.8%2C0%2C0%2C1%2C4.9%2C2%2C7%2C7%2C0%2C0%2C1%2C2%2C4.9%2C6.65%2C6.65%2C0%2C0%2C1-2.2%2C5l0.7%2C0.5a2.78%2C2.78%2C0%2C0%2C1%2C2.4%2C2s2.9%2C11.2%2C2.9%2C11.3a1.53%2C1.53%2C0%2C0%2C1-.9%2C1.9l-1.3.4a1.63%2C1.63%2C0%2C0%2C1-1.9-.9l-0.7-1.8-0.1%2C12.7h0Zm-3.6-2h1.7L14.9%2C20.3l1.9-.3%2C2.4%2C6.3%2C0.3-.1c-0.2-.8-0.8-3.2-2.8-10.9a0.63%2C0.63%2C0%2C0%2C0-.6-0.5h-0.6l-1.1-.9h-1.9l-0.3-2a4.83%2C4.83%2C0%2C0%2C0%2C3.5-4.7A4.78%2C4.78%200%200%2C0%2011%202.3H10.8a4.9%2C4.9%2C0%2C0%2C0-1.4%2C9.6l-0.3%2C2h-1.9l-1%2C.9h-0.6a0.74%2C0.74%2C0%2C0%2C0-.6.5c-2%2C7.5-2.7%2C10-3%2C10.9l0.3%2C0.1%2C2.5-6.3%2C1.9%2C0.3%2C0.2%2C15.8h1.6l0.6-8.4a1.52%2C1.52%2C0%2C0%2C1%2C1.5-1.4%2C1.5%2C1.5%2C0%2C0%2C1%2C1.5%2C1.4l0.9%2C8.4h0Zm-10.9-9.6h0Zm17.5-.1h0Z"%20style%3D"fill%3A%23333%3Bopacity%3A0.7%3Bisolation%3Aisolate"%2F>%0A<path%20d%3D"M5.9%2C13.6l1.1-.9h7.8l1.2%2C0.9"%20style%3D"fill%3A%23ce592c"%2F>%0A<ellipse%20cx%3D"10.9"%20cy%3D"13.1"%20rx%3D"2.7"%20ry%3D"0.3"%20style%3D"fill%3A%23ce592c%3Bopacity%3A0.5%3Bisolation%3Aisolate"%2F>%0A<path%20d%3D"M20.6%2C26.1l-2.9-11.3a1.71%2C1.71%2C0%2C0%2C0-1.6-1.2H5.7a1.69%2C1.69%2C0%2C0%2C0-1.5%2C1.3l-3.1%2C11.3a0.61%2C0.61%2C0%2C0%2C0%2C.3.7l1.1%2C0.4a0.61%2C0.61%2C0%2C0%2C0%2C.7-0.3l2.7-6.7%2C0.2%2C16.8h3.6l0.6-9.3a0.47%2C0.47%2C0%2C0%2C1%2C.44-0.5h0.06c0.4%2C0%2C.4.2%2C0.5%2C0.5l0.6%2C9.3h3.6L15.7%2C20.3l2.5%2C6.6a0.52%2C0.52%2C0%2C0%2C0%2C.66.31h0l1.2-.4a0.57%2C0.57%2C0%2C0%2C0%2C.5-0.7h0Z"%20style%3D"fill%3A%23fdbf2d"%2F>%0A<path%20d%3D"M7%2C13.6l3.9%2C6.7%2C3.9-6.7"%20style%3D"fill%3A%23cf572e%3Bopacity%3A0.6%3Bisolation%3Aisolate"%2F>%0A<circle%20cx%3D"10.9"%20cy%3D"7"%20r%3D"5.9"%20style%3D"fill%3A%23fdbf2d"%2F>%0A<%2Fsvg>%0A'


class StreetMap extends Component {

  state = {
    places: [],
    coords: { lat: -33.866, lng: 151.196 },
    currentPlaceInfoShowing: null,
    // watcherId: null,
  }

  mapRef = null
  setMapRef = element => this.mapRef = element


  success = ({ coords: { latitude: lat, longitude: lng } }) => {
    this.setState({ coords: { lat, lng } })
    this.getNearbyBanks({lat, lng})

  };

  error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    
  };

  handleDragMarker = ({ latLng }) => {
    const coords = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };
    this.setState({ coords });
  };

  

  getNearbyBanks = ({lat,lng}) => {
    const mapObject = this.mapRef.context[MAP];
    const service = new google.maps.places.PlacesService(mapObject)
    const request = {
      location: new google.maps.LatLng(lat, lng),
      radius: '1000',
      type: ['bank']
    };
    service.nearbySearch(request, (places, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.setState({ places })
        console.log(places);
      }
    });
  }

  componentDidMount() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000
    };

    navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    // const id = navigator.geolocation.watchPosition(this.success, this.error, options);

    // this.setState({ watcherId: id })
  }

  componentWillUnmount() {
    // navigator.geolocation.clearWatch(this.watcherId);
  }

  render() {
    return (
      <GoogleMap
        ref={this.setMapRef}
        defaultZoom={16}
        defaultCenter={this.state.coords}
        // clickableIcons={false}
        center={this.state.coords}
        options={{
          mapTypeControl: false
        }}
      >
        <Marker
          key="my_current_pos"
          draggable
          icon={PERSON_ICON}
          position={this.state.coords}
          onDragEnd={this.handleDragMarker}
        />
        {
          this.state.places.map(place => {
            return (
              <Marker
                key={ place.place_id }
                position={place.geometry.location}
                onClick={()=>{
                   console.log("marker click", place)
                   this.setState({currentPlaceInfoShowing: place.place_id})
                   console.log(`https://maps.google.com/maps?ll=${place.geometry.location.lat()},${place.geometry.location.lng()}&z=16&cid=5883366229240384648`)
               }}
              >
                {
                  place.place_id === this.state.currentPlaceInfoShowing 
                  && <InfoWindow onCloseClick={()=>{
                    this.setState({currentPlaceInfoShowing: null})
                  }}>
                  <div>
                    <p className={styles.infowindowTitle}>{place.name} </p>
                    {
                      place.vicinity.split(",").map((addressLine,index) =>(
                        <p key={'address'+index} className={styles.infowindowInfo}>
                         {addressLine}
                        </p>
                      ))
                    }
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`}
                       className={styles.infowindowLink}
                      target='_blank' 
                      rel="noopener noreferrer">
                      Ver en google maps
                    </a>
                    
                  </div>
                 </InfoWindow>
                }
              </Marker>
            )
          })
        }
      </GoogleMap>
    )
  }
}

const NearbyBanksMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${ process.env.REACT_APP_GOOGLE_MAPS_KEY }&v=3.exp&libraries=geometry,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div className='mapcontainer' style={{ height: '800px', position: 'relative' }} />,
    mapElement: <div className='map' style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(props => <StreetMap {...props} />)


export default NearbyBanksMap