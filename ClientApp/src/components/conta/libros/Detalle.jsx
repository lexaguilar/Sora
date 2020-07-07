import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem } from 'devextreme-react/form';
import { LoadPanel } from 'devextreme-react/load-panel';
import 'devextreme-react/text-area';
import { createStore, createCustomStore } from '../../../utils/proxy';
import { Column, ColumnChooser, HeaderFilter, SearchPanel, Lookup, Editing, Summary, TotalItem, RequiredRule, StringLengthRule, Scrolling }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { getTicks, cellRender } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultComprobante } from '../../../data/comprobante';
import moment from 'moment';
import numeral from 'numeral';
import { updateLibroMayor } from '../../../store/libroMayor/libroMayorActions';

class Detalle extends React.Component {
  constructor(props) {
    super(props);
    this.onShowing = this.onShowing.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.state= {
        comprobante : []
    }
  }


  onShowing(e) {

    const { libroMayor } = this.props;
    console.log(libroMayor);
    http(`asientos/cuenta/${libroMayor.id}/year/${libroMayor.year}/month/${libroMayor.mes}/debe/${libroMayor.debe}/libro-mayor`).asGet().then(r => {
        this.setState({
          comprobante: r
        })
    });
   }

  onHiding({ cancel }) {

    let { updateLibroMayor } = this.props;

    updateLibroMayor({
      id: 0,
      open: false
    });
    
  }

  render() {

    const { libroMayor } = this.props;


    return (
      <div id="container">

        <Popup
          width={800}
          height={550}
          //title={Comprobante ${numeral(this.state.comprobante.numero).format('000000')}`}`}
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={libroMayor.open}
        >

            <DataGrid               
                //ref={(ref) => this.refAsientosDetalle = ref}
                dataSource={this.state.comprobante}
                selection={{ mode: 'single' }}
                showBorders={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}

              >
                <Scrolling mode="virtual" />
                <SearchPanel visible={true} /> 
                <Column dataField="fecha" />
                <Column dataField="anio" />
                <Column dataField="descripcion" />
                <Column dataField="monto" />
                <Column dataField="concepto" />
              </DataGrid>
        
        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  libroMayor: state.libroMayor
});

const mapDispatchToPros = ({
    updateLibroMayor
});

export default connect(mapStateToProps, mapDispatchToPros)(Detalle);
