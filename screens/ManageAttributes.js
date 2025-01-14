/*
 * DECODE App – A mobile app to control your personal data
 * Copyright (C) 2019 – Thoughtworks Ltd.
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: ula@dribia.com
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, Platform } from 'react-native';
import { translate } from 'react-i18next';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Picker from 'react-native-picker-select';
import { SecureStore } from 'expo';
import Button from '../application/components/Button/Button';
import LinkButton from '../application/components/LinkButton/LinkButton';
import DeleteButton from '../application/components/DeleteButton/DeleteButton';
import Logo from '../application/components/ScreenLogo/ScreenLogo';
import { saveAttributes } from '../application/redux/actions/attributes';
import { sortedDistrictsList, districtNameFromId, validDistrict } from '../lib/districts';
import { resetNavigation, goBack } from '../application/redux/actions/navigation';
import { deleteWalletData } from '../application/redux/actions/wallet';
import styles from './styles';
import i18n from '../i18n';
import { sortedGendersList, validGender, mapGenderIdToName } from '../lib/genders';


const maxDate = new Date();
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 130);

export const PickerComponent = props => (
  <View id={props.id} style={{ flex: 1, maxHeight: 60 }}>
    <View style={styles.newAttributesAttribute}>
      <Text style={styles.newAttributesAttributeName}>{props.title}</Text>
      <Picker
        placeholder={{ label: props.placeholder, value: 0 }}
        items={props.items}
        onValueChange={props.onValueChange}
        value={props.currentValue}
        style={{ viewContainer: { alignSelf: 'center' } }}
      >
        <LinkButton
          id={props.buttonId}
          name={props.currentValue ? props.t('edit') : props.t('add')}
          onPress={() => {}}
          style={{ textStyle: { fontSize: 18 } }}
        />
      </Picker>
    </View>
    <View>
      <Text
        id={props.valueTextId}
        style={styles.newAttributesAttributeValue}
      >
        { props.mapIdToName(props.currentValue) }
      </Text>
    </View>
  </View>
);

PickerComponent.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onValueChange: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
  mapIdToName: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  buttonId: PropTypes.string.isRequired,
  valueTextId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

class ManageAttributes extends Component {
  static route = {
    navigationBar: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
      borderBottomColor: 'white',
      elevation: 1,
      fontSize: 20,
      fontWeight: '500',
      tintColor: 'rgb(0,163,158)',
      renderTitle: () => <View  style={{marginLeft: Platform.OS === 'ios' ? -20 : -60,}} ><Logo/></View>,
      height: 80,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      currentDate: props.currentDateAttr.object,
      district: props.districtAttr.object,
      gender: props.genderAttr.object,
    };
  }

  onSetDateOfBirth = (date) => {
    this.setState({
      currentDate: moment(date).format('DD/MM/YYYY'),
      isDatePickerVisible: false,
    });
  }

  onSetDistrict = (district) => {
    if (validDistrict(district)) {
      this.setState({
        district,
      });
    }
  }

  onSetGender = (gender) => {
    if (validGender(gender)) {
      this.setState({
        gender,
      });
    }
  };

  districtsList = () => (
    sortedDistrictsList()
      .map(district => ({ label: district[1], value: district[0] }))
  )

  gendersList = () => (
    sortedGendersList()
      .map(gender => ({ label: this.props.t(`genders:${gender[1]}`), value: gender[0] }))
  )

  render() {
    if (this.props.errorSaveAttributes) {
      alert('ERROR');
    }

    const districtComponent = (<PickerComponent
      items={this.districtsList()}
      onValueChange={this.onSetDistrict}
      currentValue={this.state.district}
      mapIdToName={districtNameFromId}
      title={this.props.t('districtAttribute')}
      placeholder={this.props.t('districtPlaceholder')}
      t={this.props.t}
      buttonId="district-action-button"
      valueTextId="district-info"
      id="district"
    />);

    const genderComponent = (<PickerComponent
      items={this.gendersList()}
      onValueChange={this.onSetGender}
      currentValue={this.state.gender}
      mapIdToName={id => mapGenderIdToName(id, this.props.t)}
      title={this.props.t('genderAttribute')}
      placeholder={this.props.t('genderPlaceholder')}
      t={this.props.t}
      buttonId="gender-action-button"
      valueTextId="gender-info"
      id="gender"
    />);

    return (
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <DeleteButton
          onPress={() => this.props.deleteWalletData(this.props.t)}
        />
        <View style={styles.attributesManagementContainer}>
          <View style={{ flex: 1, maxHeight: 60 }}>
            <Text style={{ fontSize: 16 }}>{this.props.t('description')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, maxHeight: 60 }}>
              <View style={styles.newAttributesAttribute}>
                <Text style={styles.newAttributesAttributeName}>{this.props.t('ageAttribute')}</Text>
                <LinkButton
                  id="age-action-button"
                  name={this.state.currentDate ? this.props.t('edit') : this.props.t('add')}
                  onPress={() => this.setState({ isDatePickerVisible: true })}
                  style={{ textStyle: { fontSize: 18 } }}
                />
              </View>
              <View>
                <Text
                  id="age-info"
                  style={styles.newAttributesAttributeValue}
                >
                  { this.state.currentDate }
                </Text>
              </View>
            </View>
            { districtComponent }
            { this.props.genderAttributeFT && genderComponent }
          </View>
          <DateTimePicker
            minimumDate={minDate}
            maximumDate={maxDate}
            datePickerModeAndroid='spinner'
            isVisible={this.state.isDatePickerVisible}
            onConfirm={this.onSetDateOfBirth}
            onCancel={() => this.setState({ isDatePickerVisible: false })}
          />
        </View>
        <View style={{ flex: 2 }}>
          <Button
            name={this.props.t('save')}
            onPress={() => this.props.saveAttributes(
              this.state.currentDate,
              this.state.district,
              this.state.gender,
              this.props.walletId,
            )}
          />
        </View>
      </View>
    );
  }
}

ManageAttributes.propTypes = {
  t: PropTypes.func.isRequired,
  saveAttributes: PropTypes.func.isRequired,
  walletId: PropTypes.string.isRequired,
  errorSaveAttributes: PropTypes.bool.isRequired,
  currentDateAttr: PropTypes.shape({
    object: PropTypes.string,
  }),
  districtAttr: PropTypes.shape({
    object: PropTypes.string,
  }),
  genderAttr: PropTypes.shape({
    object: PropTypes.string,
  }),
  deleteWalletData: PropTypes.func.isRequired,
  genderAttributeFT: PropTypes.bool.isRequired,
};

ManageAttributes.defaultProps = {
  currentDateAttr: {
    object: '',
  },
  districtAttr: {
    object: '',
  },
  genderAttr: {
    object: '',
  },
};

const mapStateToProps = state => ({
  walletId: state.wallet.id,
  currentDateAttr: state.attributes.list.get('schema:dateOfBirth'),
  districtAttr: state.attributes.list.get('schema:district'),
  genderAttr: state.attributes.list.get('schema:gender'),
  errorSaveAttributes: state.attributes.errorSaveAttributes,
  genderAttributeFT: state.featureToggles.genderAttribute,
});

const mapDispatchToProps = dispatch => ({
  saveAttributes: async (dateOfBirth, district, gender, walletId) => {
    dispatch(saveAttributes(dateOfBirth, district, gender, walletId, SecureStore.setItemAsync));
    dispatch(goBack());
  },

  deleteWalletData: (t) => {
    const errorDeletingWalletData = () => alert(t('errorDelete')); //eslint-disable-line
    const successDeletingWalletData = () => dispatch(resetNavigation());
    return dispatch(deleteWalletData(
      SecureStore.deleteItemAsync,
      errorDeletingWalletData,
      successDeletingWalletData,
    ));
  },
});

export default translate(['manageAttributes', 'genders'], { i18n })(connect(mapStateToProps, mapDispatchToProps)(ManageAttributes));
