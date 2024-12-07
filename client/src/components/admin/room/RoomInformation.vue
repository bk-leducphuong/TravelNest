<script>
export default {
    props: {
        roomInformation: {
            type: Object,
            required: true
        },
        mode: {
            type: String,
            required: true
        }
    },
    methods: {
        
    }
}
</script>
<template>
  <div class="room__detail--form">
    <div class="title__form">
      <h2><strong>Room Details</strong></h2>
    </div>
    <form action="">
      <div class="room__detail--select">
        <div class="row">
          <div class="col-md-6 col-12">
            <label for="">Apartment Type</label>
            <br />
            <select class="form-control" name="" id="">
              <option value="please select">Please select</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="twin">Twin</option>
              <option value="twin/double">Twin/Double</option>
              <option value="quad">Quad</option>
            </select>
          </div>
          <div class="col-md-6 col-12"></div>
          <div class="col-md-6 col-12">
            <label for="">Room name</label>
            <br />
            <select class="form-control" name="" id="">
              <option value="please select">Please select</option>
              <option value="single">Japanese Style Room</option>
              <option value="double">Family Room with Balcony</option>
              <option value="twin">Family Room with Sauna</option>
              <option value="twin/double">Family Room with Sea View</option>
              <option value="quad">Family Room with Terrace</option>
            </select>
            <p>This is the name guests will see on the Booking.com Website</p>
          </div>
          <div class="col-md-6 col-12">
            <label for="">Custom name (optional)</label>
            <br />
            <input class="form-control" type="text" />
            <p>Create an optional, custom name for your reference</p>
          </div>
          <div class="col-md-6 col-12">
            <label for="">Number of rooms (of this type)</label>
            <br />
            <input class="form-control" type="number" placeholder="1" />
            <p>Out of 4 apartment (in total)</p>
          </div>
          <div class="col-md-6 col-12">
            <label for="">Smoking policy</label>
            <br />
            <select class="form-control" name="" id="">
              <option value="non-smoking">None-smoking</option>
              <option value="non-smoking">Smoking</option>
            </select>
          </div>
          <div class="col-md-6 col-12 offset-md-6">
            <label for="">Room near the pool</label>
            <br />
            <select class="form-control" name="" id="">
              <option value="non-smoking">No selection</option>
              <option value="non-smoking">All these rooms are near the pool</option>
              <option value="non-smoking">Some of these rooms are near the pool</option>
              <option value="non-smoking">None of these rooms are near the pool</option>
            </select>
          </div>
        </div>
      </div>
      <div class="room__location">
        <h3>Apartment location</h3>
        <p>
          Select one or more floors on which the apartment is located (optional) <br />
          Note: Number 1 stands for the first floor above the ground level
        </p>
        <div class="row" style="padding: 30px 0px">
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">0</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">1</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">2</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">3</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">4</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">5</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">6</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">7</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">8</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">9</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">10</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">11</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">12</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">13</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">14</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">15</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">16</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">17</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">18</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">19</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">20</label>
          </div>
          <div class="col-1">
            <input type="checkbox" value="0" />
            <label for="">21</label>
          </div>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button class="select--all">Select all</button>
          <button class="deselect--all">Deselect all</button>
        </div>

        <p>
          This feature will help your guests understand which floor this option is available on. If
          it's available on both the ground floor and upper floors
        </p>
        <strong style="margin-bottom: 10px">Rooms on this floor and above are considered </strong>
        <br />
        <input class="form-control" type="number" value="22" style="width: 30%" />
      </div>
      <div class="bed__option">
        <h3>Bed options and occupancy</h3>
        <p>All fields required</p>
        <div class="bed__select">
          <p style="color: blue; font-weight: 600">Standard Arrangement</p>
          <p>What kind of beds are available in this room</p>
        </div>
        <div class="row">
          <div class="col-md-6 col-12">
            <select name="" id="" style="width: 100%" class="form-control">
              <option value="">Select a bed type</option>
              <option value="">Twin bed(s) / 90-130 cm wide</option>
              <option value="">Full bed(s) / 131-150 cm wide</option>
              <option value="">Queen bed(s) / 151-180 cm wide</option>
            </select>
          </div>
          <div class="col-md-6 col-12">
            <select name="" id="" style="width: 100%" class="form-control">
              <option value="">Select number of beds</option>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
              <option value="">4</option>
              <option value="">5</option>
              <option value="">6</option>
              <option value="">7</option>
              <option value="">8</option>
              <option value="">9</option>
            </select>
          </div>
        </div>
        <br />
        <button class="add-bed"><i class="fa-solid fa-plus"></i> Add another bed</button>
        <br />
        <strong>Occupancy</strong>
        <p>
          The occuapancy you set here is only for guests staying in existing beds. Occupancy from
          guests staying in cribs and extra beds shouldn't be included
        </p>
        <p>
          Go to the <a href="">Child policies and rates page</a> to check or edit your child
          policies
        </p>
        <div class="row">
          <div class="col-md-4 col-12">
            <label for="">Max adults</label>
            <br />
            <input class="form-control" type="number" value="0" />
          </div>
          <div class="col-md-4 col-12">
            <label for="">Max children</label>
            <br />
            <input class="form-control" type="number" value="0" />
          </div>
          <div class="col-md-4 col-12">
            <label for="">Max occupancy</label>
            <br />
            <input class="form-control" type="number" value="0" />
          </div>
        </div>
      </div>
      <div class="bath__option">
        <h3>Bathroom options</h3>
        <label for="">Number of bathrooms</label>
        <br />
        <input type="number" class="form-control" style="width: 40%" value="1" />
      </div>
      <br />
      <input class="submit form-control" type="submit" value="Continue" />
    </form>
  </div>
</template>
<style scoped>
.edit1:hover,
.delete1:hover {
  background-color: #23ace3;
  color: white;
}

.upload__photo:hover {
  background-color: #468cbf;
}

.add__room {
  text-align: center;
  color: #fff;
  background-color: #23ace3;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.25s ease-in;
}

.add__room:hover {
  background-color: #276c9d;
}

.add__room i {
  font-size: 50px;
  margin-top: 10px;
  margin-bottom: 20px;
}

form {
  width: 100%;
}

.room__detail--select {
  width: 100%;
}

.room__detail--select select {
  width: 100%;
}

.room__detail--select input {
  width: 100%;
}

.room__detail--select {
  padding: 20px;
  border: thin solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #fff;
}

label {
  margin-bottom: 10px;
  margin-top: 20px;
  font-weight: 500;
}

.room__location {
  padding: 20px;
  border: thin solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #fff;
}

.room__location p {
  margin-bottom: 0;
}

.bed__option {
  padding: 20px;
  border: thin solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #fff;
}

.bath__option {
  padding: 20px;
  border: thin solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #fff;
}

.submit {
  background-color: #0a49a7;
  color: #fff;
  font-size: 20px;
}

.over__lay {
  display: none;
  width: 100vw;
  height: 100vh;
  background-color: #0000008a;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.close {
  cursor: pointer;
}

.col-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.col-1 label {
  margin: 0px !important;
}

.col-1 input {
  padding: 5px;
}

.select--all {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.select--all:hover {
  background-color: #e2e8f0;
}

.deselect--all {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.deselect--all:hover {
  background-color: #e2e8f0;
}

.add-bed {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-bed:hover {
  background-color: #e2e8f0;
}
</style>
