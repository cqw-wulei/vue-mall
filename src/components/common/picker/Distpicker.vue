<template>
  <div class="distpicker-address-wrapper">
    <template>
      <div :class="addressHeader">
        <ul>
          <li :class="{'active': tab === 1}" @click="resetProvince">{{ currentProvince && !staticPlaceholder ? currentProvince : placeholders.province }}</li>
          <template v-if="!onlyProvince">
            <li v-if="showCityTab" :class="{'active': tab === 2}" @click="resetCity">{{  currentCity && !staticPlaceholder ? currentCity : placeholders.city }}</li>
            <li v-if="showAreaTab && !hideArea" :class="{'active': tab === 3}">{{ currentArea && !staticPlaceholder ? currentArea : placeholders.area }}</li>
          </template>
        </ul>
      </div>
      <div :class="addressContainer">
        <ul v-if="tab === 1">
          <li v-for="(item, index) in provinces"
              :class="{'active': item === currentProvince}"
              @click="chooseProvince(item)"
              :key="index">
            {{ item }}
          </li>
        </ul>
        <template v-if="!onlyProvince">
          <ul v-if="tab === 2">
            <li v-for="(item, index) in cities"
                :class="{'active': item === currentCity}"
                @click="chooseCity(item)"
                :key="index">
              {{ item }}
            </li>
          </ul>
          <ul v-if="tab === 3 && !hideArea">
            <li v-for="(item, index) in areas"
                :class="{'active': item === currentArea}"
                @click="chooseArea(item)"
                :key="index">
              {{ item }}
            </li>
          </ul>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  let DISTRICTS = {}
const DEFAULT_CODE = 100000
export default {
  name: 'v-distpicker',
  props: {
    province: { type: [String, Number], default: '' },
    city: { type: [String, Number], default: '' },
    area: { type: [String, Number], default: '' },
    type: { type: String, default: '' },
    hideArea: { type: Boolean, default: false },
    onlyProvince: { type: Boolean, default: false },
    staticPlaceholder: { type: Boolean, default: false },
    placeholders: {
      type: Object,
      default() {
        return {
          province: '省',
          city: '市',
          area: '区',
        }
      }
    },
    disabled: { type: Boolean, default: false },
    addressHeader: { type: String, default: 'address-header' },
    addressContainer: { type: String, default: 'address-container' },
  },
  data() {
    return {
      tab: 1,
      showCityTab: false,
      showAreaTab: false,
      provinces: [],
      cities: [],
      areas: [],
      currentProvince: this.determineType(this.province) || this.placeholders.province,
      currentCity: this.determineType(this.city) || this.placeholders.city,
      currentArea: this.determineType(this.area) || this.placeholders.area,
    }
  },
  created() {
    let that = this
    if (window.sessionStorage.getItem('DISTRICTS')) {
      DISTRICTS = JSON.parse(window.sessionStorage.getItem('DISTRICTS'))
      this.first()
    } else {
      that.$axios({
        url: '/data/area',
        type: 'post',
        success: function (res) {
          if (res.data.code == '0000') {
            that.setAdress(res.data.result)
          }
        }
      })
    }
  },
  watch: {
    currentProvince(vaule) {
      this.$emit('province', this.setData(vaule))
      if (this.onlyProvince) this.emit('selected')
    },
    currentCity(value) {
      this.$emit('city', this.setData(value, this.currentProvince))
      if (value != this.placeholders.city && this.hideArea) this.emit('selected')
    },
    currentArea(value) {
      this.$emit('area', this.setData(value, this.currentProvince))
      if (value != this.placeholders.area) this.emit('selected')
    },
    province(value) {
      this.currentProvince = this.province || this.placeholders.province
      this.cities = this.determineValue(this.currentProvince, this.placeholders.province)
    },
    city(value) {
      this.currentCity = this.city || this.placeholders.city
      this.areas = this.determineValue(this.currentCity, this.placeholders.city, this.currentProvince)
    },
    area(value) {
      this.currentArea = this.area || this.placeholders.area
    },
  },
  methods: {
    first: function() {
      if (this.type != 'mobile') {
        this.provinces = this.getDistricts()
        this.cities = this.province ? this.getDistricts(this.getAreaCode(this.determineType(this.province))) : []
        this.areas = this.city ? this.getDistricts(this.getAreaCode(this.determineType(this.city), this.area)) : []
      } else {
        if (this.area && !this.hideArea && !this.onlyProvince) {
          this.tab = 3
          this.showCityTab = true
          this.showAreaTab = true
          this.areas = this.getDistricts(this.getAreaCode(this.determineType(this.city), this.area))
        } else if (this.city && this.hideArea && !this.onlyProvince) {
          this.tab = 2
          this.showCityTab = true
          this.cities = this.getDistricts(this.getAreaCode(this.determineType(this.province)))
        } else {
          this.provinces = this.getDistricts()
        }
      }
    },
    setAdress: function(data) {
      let _data = {}
      for (let i in data) {
        _data[data[i].code] = data[i].name
      }
      DISTRICTS['100000'] = _data
      for (let i in data) {
        let _twoData = {}
        for (let j in data[i].children) {
          _twoData[data[i].children[j].code] = data[i].children[j].name
        }
        DISTRICTS[data[i].code] = _twoData
      }
      for (let i in data) {
        for (let j in data[i].children) {
          if (data[i].children[j].children) {
            let _threeData = {}
            for (let k in data[i].children[j].children) {
              _threeData[data[i].children[j].children[k].code] = data[i].children[j].children[k].name
            }
            DISTRICTS[data[i].children[j].code] = _threeData
          }
        }
      }
      delete DISTRICTS['100000']['710000']
      delete DISTRICTS['100000']['810000']
      delete DISTRICTS['100000']['820000']
      window.sessionStorage.setItem('DISTRICTS',JSON.stringify(DISTRICTS))
      this.first()
    },
    setData(value, check = '') {
      return {
        code: this.getAreaCode(value, check),
        value: value,
      }
    },
    emit(name) {
      let data = {
        province: this.setData(this.currentProvince)
      }

      if (!this.onlyProvince) {
        this.$set(data, 'city', this.setData(this.currentCity))
      }

      if (!this.onlyProvince || this.hideArea) {
        this.$set(data, 'area', this.setData(this.currentArea))
      }

      this.$emit(name, data)
    },
    getCities() {
      this.currentCity = this.placeholders.city
      this.currentArea = this.placeholders.area
      this.cities = this.determineValue(this.currentProvince, this.placeholders.province)
      this.cleanList('areas')
      if (this.cities.length === 0) {
        this.emit('selected')
        this.tab = 1
        this.showCityTab = false
      }
    },
    getAreas() {
      this.currentArea = this.placeholders.area
      this.areas = this.determineValue(this.currentCity, this.placeholders.city, this.currentProvince)
      if (this.areas.length === 0) {
        this.emit('selected')
        this.tab = 2
        this.showAreaTab = false
      }
    },
    resetProvince() {
      this.tab = 1
      this.provinces = this.getDistricts()
      this.showCityTab = false
      this.showAreaTab = false
    },
    resetCity() {
      this.tab = 2
      this.showCityTab = true
      this.showAreaTab = false
      this.getCities()
    },
    chooseProvince(name) {
      this.currentProvince = name
      if (this.onlyProvince) return
      this.tab = 2
      this.showCityTab = true
      this.showAreaTab = false
      this.getCities()
    },
    chooseCity(name) {
      this.currentCity = name
      if (this.hideArea) return
      this.tab = 3
      this.showCityTab = true
      this.showAreaTab = true
      this.getAreas()
    },
    chooseArea(name) {
      this.currentArea = name
    },
    getAreaCodeByPreCode(name, preCode) {
      let codes = []

      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(name === DISTRICTS[x][y]) {
            codes.push(y)
          }
        }
      }

      if (codes.length > 1) {
        let index
        codes.forEach((item, i) => {
          if (item.slice(0, 2) == preCode) {
            index = i
          }
        })

        return codes[index]
      } else {
        return codes[0]
      }
    },
    getAreaCode(name, check = '') {
      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(name === DISTRICTS[x][y]) {
            if (check.length > 0) {
              if (y.slice(0, 2) !== this.getAreaCodeByPreCode(check, y.slice(0, 2)).slice(0, 2)) {
                continue
              } else {
                return y
              }
            } else {
              return y
            }
          }
        }
      }
    },
    getCodeValue(code) {
      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(code === parseInt(y)) {
            return DISTRICTS[x][y]
          }
        }
      }
    },
    getDistricts(code = DEFAULT_CODE) {
      return DISTRICTS[code] || []
    },
    determineValue(currentValue, placeholderValue, check = '') {
      if(currentValue === placeholderValue) {
        return []
      } else {
        return this.getDistricts(this.getAreaCode(currentValue, check))
      }
    },
    determineType(value) {
      if(typeof value === 'number') {
        return this.getCodeValue(value)
      }

      return value
    },
    cleanList(name) {
      this[name] = []
    },
  }
}
</script>

<style lang="scss">
.distpicker-address-wrapper {
  color: #9caebf;
  select {
    padding: .5rem .75rem;
    height: 40px;
    font-size: 1rem;
    line-height: 1.25;
    color: #464a4c;
    background-color: #fff;
    background-image: none;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15); /*no*/
    border-radius: .25rem;
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;

    option {
      font-weight: normal;
      display: block;
      white-space: pre;
      min-height: 1.2em;
      padding: 0px 4px 2px; /*px*/
    }
  }
  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }
  }
  .address-header {
    background-color: #fff;

    ul {
      display: flex;
      justify-content: space-around;
      align-items: stretch;

      li {
        display: inline-block;
        padding: 20px 20px 14px; /*px*/

        &.active {
          border-bottom: #52697f solid 3px; /*no*/
          color: #52697f;
        }
      }
    }
  }
  .address-container {
    background-color: #fff;
    height: 700px;
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
    overflow-scrolling: touch;
    ul {
      height: 100%;
      overflow: auto;

      li {
        font-size: 30px; /*px*/
        padding: 16px 20px; /*px*/
        border-top: 1px solid #f6f6f6; /*no*/

        &.active {
          color: #52697f;
        }
      }
    }
  }
}
</style>
