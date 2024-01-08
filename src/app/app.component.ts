import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElevatorFloor } from '../models/elevator-floor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'evelator';
  floor: number = 0;
  isUp: boolean = true;
  elevatorMove:boolean=false;
  floors: ElevatorFloor[] = [
    { floor: 0, isUpActive: false, isDownActive: false },
    { floor: 1, isUpActive: false, isDownActive: false },
    { floor: 2, isUpActive: false, isDownActive: false },
    { floor: 3, isUpActive: false, isDownActive: false },
    { floor: 4, isUpActive: false, isDownActive: false },
    { floor: 5, isUpActive: false, isDownActive: false },
    { floor: 6, isUpActive: false, isDownActive: false },
    { floor: 7, isUpActive: false, isDownActive: false },
    { floor: 8, isUpActive: false, isDownActive: false },
    { floor: 9, isUpActive: false, isDownActive: false },
    { floor: 10, isUpActive: false, isDownActive: false },
  ];

  moveElevator() {
    this.floorMoveControl();
    let interval = setInterval(() => {
      if (this.isFullPassive()){
        clearInterval(interval);
        this.elevatorMove=false;
        return
      }
      if(this.isUp) this.floor ++;
      else this.floor --;
      this.currentFloorControl(interval);
    }, 300);
  }

  currentFloorControl(interval:NodeJS.Timeout){
    let currentFloor = this.getElevatorFloor(this.floor)
    let elevatorUpControl = this.floors.filter(currentFloor=>currentFloor.floor>this.floor && (currentFloor.isDownActive==true || currentFloor.isUpActive==true)).length < 1;
    let elevatorDownControl = this.floors.filter(currentFloor=>currentFloor.floor<this.floor && (currentFloor.isDownActive==true || currentFloor.isUpActive==true)).length < 1;
    
    
    if((this.isUp && currentFloor?.isUpActive)||(!this.isUp && currentFloor?.isUpActive && elevatorDownControl)){
      //durdu yukarı işareti söndü devam
      clearInterval(interval);
      currentFloor.isUpActive=false;
        setTimeout(() => {
          this.moveElevator();
        }, 700);
    }
    else if ((!this.isUp && currentFloor?.isDownActive)||(this.isUp && currentFloor?.isDownActive && elevatorUpControl)){
      clearInterval(interval);
      currentFloor.isDownActive=false;
        setTimeout(() => {
          this.moveElevator();
        }, 700);
    }
  }

  floorMoveControl() {
    let filterUpActive =
      this.floors.filter(
        (elevatorFloor) =>
          elevatorFloor.floor > this.floor &&
          (elevatorFloor.isUpActive == true ||
            elevatorFloor.isDownActive == true)
      ).length > 0;

    let filterDownActive =
      this.floors.filter(
        (elevatorFloor) =>
          elevatorFloor.floor < this.floor &&
          (elevatorFloor.isUpActive == true ||
            elevatorFloor.isDownActive == true)
      ).length > 0;
      
    if (this.floor == 0) this.isUp = true;
    else if (this.floor == 10) this.isUp = false;
    else if (this.isUp && filterUpActive) this.isUp = true;
    else if (!this.isUp && filterDownActive) this.isUp = false;
    else if (filterUpActive) this.isUp = true;
    else if (filterDownActive) this.isUp = false;
  }

  elevatorUp(floorNum: number) {
    if(floorNum == this.floor) return;
    let floorInfo = this.getElevatorFloor(floorNum);
    floorInfo!.isUpActive = true;
    if (!this.elevatorMove)
    {
      this.elevatorMove=true;
      this.moveElevator();
    }
  }

  elevatorDown(floorNum: number) {
    if(floorNum == this.floor) return;
    let floorInfo = this.getElevatorFloor(floorNum);
    floorInfo!.isDownActive = true;
    if (!this.elevatorMove)
    {
      this.elevatorMove=true;
      this.moveElevator();
    }
  }

  getElevatorFloor(floor: number) {
    return this.floors.find((floorNum) => floorNum.floor == floor);
  }

  getClass(floorNum:number,isUp:boolean):string{
    let isUpActive = this.getElevatorFloor(floorNum)?.isUpActive? "active": "passive"
    let isDownActive = this.getElevatorFloor(floorNum)?.isDownActive? "active": "passive"
    if(isUp) return isUpActive
    else return isDownActive
  }

  isFullPassive(){
    return this.floors.filter(elevatorFloor=> elevatorFloor.isUpActive == true || elevatorFloor.isDownActive == true).length == 0
  }
}
