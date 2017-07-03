import React from 'react'
import { connect } from 'react-redux'
import {CSVLink, CSVDownload} from 'react-csv';

class LocationsContainerView extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            overlay: false
        }
    }

    // when Firebase returns the data, we set it in the state
    componentWillReceiveProps (props) {

        this.setState({
            locations: props.locations
        });
    }

    // Add location to database
    pushLocation () {

        var streetInput = document.getElementById('street'),
            wardInput = document.getElementById('ward'),
            districtInput = document.getElementById('district'),
            cityInput = document.getElementById('city'),
            countryInput = document.getElementById('country');
            
        if((streetInput.value !== '') && (wardInput.value !== '') && (districtInput.value !== '') && (cityInput.value !== '') && (countryInput.value !== '')) {
            var newLocation = {
                street: streetInput.value,
                ward: wardInput.value,
                district: districtInput.value,
                city: cityInput.value,
                country: countryInput.value
            }

            firebase.database().ref('/locations').push(newLocation, function () {
                streetInput.value = null;
                wardInput.value = null;
                districtInput.value = null;
                cityInput.value = null;
                countryInput.value = null;
            });
        }
        return false;
    }

    // toggle the overlay to edit the location
    toggleUpdateLocationOverlay (ref, location) {

        // showing the overlay and setting a reference to the location key
        this.setState({
            overlay: true,
            currentLocation: ref
        });

        setTimeout(() => {
            document.getElementById('edit-street').value = location.street;
            document.getElementById('edit-ward').value = location.ward;
            document.getElementById('edit-district').value = location.district;
            document.getElementById('edit-city').value = location.city;
            document.getElementById('edit-country').value = location.country;
        }, 500)
    }

    // remove location in database
    updateLocation () {

        var newData = {
            street: document.getElementById('edit-street').value,
            ward: document.getElementById('edit-ward').value,
            district: document.getElementById('edit-district').value,
            city: document.getElementById('edit-city').value,
            country: document.getElementById('edit-country').value
        }

        var updatedLocation = {};
            updatedLocation['/locations/' + this.state.currentLocation] = newData;

        firebase.database().ref().update(updatedLocation);

        // hiding the overlay
        this.setState({
            overlay: false
        });
    }

    // clicking on the big 'x' on the overlay will close the overlay
    cancelUpdateLocation () {
        this.setState({
            overlay: false
        });
    }

    // remove location from database
    removeLocation (ref) {

        firebase.database().ref('/locations/' + ref).remove();
    }



    getFileName() {
        if (!this.state.filename) return undefined;
        if (!this.state.filename.endsWith('.csv')) return  'mycsv.csv';
        return this.state.filename;
    }

    render () {

        // saving the state locations as a variable to make it easier to reference later on
        var locations = this.state.locations || {}

        // to demonstrate that we have got the firebase data we will construct a table.
        // here we are iterating through each object and creating a table row.
        // notice 'Object.keys(locations || {})' - the empty brackets are there as a fall back for when we have
        // no data to iterate through. This will prevent React from throwing an error. Once Firebase has returned the data,
        // the render will occur again with the 'locations' variable populated.
        var locationTableContent = Object.keys(locations).map(function (item, i) {
            return <tr key={i}>
                <td>
                    {locations[item].street}
                </td>
                <td>
                    {locations[item].ward}
                </td>
                <td>
                    {locations[item].district}
                </td>
                <td>
                    {locations[item].city}
                </td>
                <td>
                    {locations[item].country}
                </td>
                <td>
                    <button type="button"
                            className="button positive"
                            onClick={() => this.toggleUpdateLocationOverlay(item, locations[item])}>
                        Edit
                    </button>
                </td>
            </tr>
        }.bind(this));

        return (
            <div>
                <main className="main">
                    <h1 className="title">
                        The Test with Firebase redux react
                    </h1>
                    <section className="block">
                        <h2 className="sub-title">Create a address</h2>
                        <form>
                            <div>
                                <label htmlFor="street">
                                    <span>street:</span>
                                    <input type="text" id="street" />
                                </label>
                                <label htmlFor="ward">
                                    <span>Ward:</span>
                                    <input type="text" id="ward" />
                                </label>
                                <label htmlFor="district">
                                    <span>district:</span>
                                    <input type="text" id="district" />
                                </label>
                                <label htmlFor="city">
                                    <span>city:</span>
                                    <input type="text" id="city" />
                                </label>
                                <label htmlFor="country">
                                    <span>coutry:</span>
                                    <input type="text" id="country" />
                                </label>
                            </div>
                            <button type="button"
                                    className="button positive"
                                    onClick={() => this.pushLocation()}>
                                Create
                            </button>
                        </form>
                    </section>
                    <section className="block block-address-list">
                        <h2 className="sub-title">Address list</h2>
                        <div className="csv">
                            <a id = "export" href="javascript:void(0)">Download CSV</a>
                        </div>
                        <div id="table-container">
                            <table className="table" height="400">
                                <thead>
                                    <tr>
                                        <th>
                                            street
                                        </th>
                                        <th>
                                            Ward
                                        </th>
                                        <th>
                                            district
                                        </th>
                                        <th>
                                            city
                                        </th>
                                        <th>
                                            country
                                        </th>
                                        <th>
                                            edit
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {locationTableContent}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
                {this.state.overlay === true ?
                    <section className="overlay">
                        <div className="container">
                            <h2 className="sub-title">Edit the location</h2>
                            <form>
                                <div>
                                    <label htmlFor="edit-street">
                                        <span>street:</span>
                                        <input type="text" id="edit-street" />
                                    </label>
                                    <label htmlFor="edit-ward">
                                        <span>ward:</span>
                                        <input type="text" id="edit-ward" />
                                    </label>
                                    <label htmlFor="edit-district">
                                        <span>district:</span>
                                        <input type="text" id="edit-district" />
                                    </label>
                                    <label htmlFor="edit-city">
                                        <span>city:</span>
                                        <input type="text" id="edit-city" />
                                    </label>
                                    <label htmlFor="edit-country">
                                        <span>country:</span>
                                        <input type="text" id="edit-country" />
                                    </label>
                                </div>
                                <button type="button"
                                        className="button positive"
                                        onClick={() => this.updateLocation()}>
                                    Update
                                </button>
                                <button type="button"
                                        className="button cancel"
                                        onClick={() => this.cancelUpdateLocation()}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                        <button type="button"
                                className="button close"
                                onClick={() => this.cancelUpdateLocation()}>
                            x
                        </button>
                    </section>
                : null }
            </div>
        )
    }
}

// using mapStateToProps to get the store into the page
var mapStateToProps = (state) => {

    return {
        locations: state.locations
    }
}

const LocationsContainer = connect(mapStateToProps)(LocationsContainerView)

export default LocationsContainer
