import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateName'
})
export class StateNamePipe implements PipeTransform {

  transform(stateId: number, stateData: any[]): unknown {

    const state = stateData.find((ele:any) => ele.state_id == stateId);
    return state ? state.state_name : 'Unknown';

  }

}
