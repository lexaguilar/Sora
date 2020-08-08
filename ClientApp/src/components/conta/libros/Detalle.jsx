import React from 'react';
import { Popup, Button } from 'devextreme-react';
import 'devextreme-react/text-area';
import { Column, SearchPanel, Scrolling }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import { connect } from 'react-redux';
import { updateLibroMayor } from '../../../store/libroMayor/libroMayorActions';
import { cellRender, cellRenderBold } from '../../../utils/common';

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
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={libroMayor.open}
          title={libroMayor.cuenta}
        >

            <DataGrid               
                dataSource={this.state.comprobante}
                selection={{ mode: 'single' }}
                showBorders={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}

              >
                <Scrolling mode="virtual" />
                <SearchPanel visible={true} /> 
                <Column width="100" dataField="fecha" dataType="date" format="dd/MM/yyyy" alignment="right" />
                <Column width="50" dataField="anio" />
                <Column width="70" dataField="numero" />
                <Column dataField="referencia" />
                <Column dataField="descripcion" />
                <Column width="100" dataField="monto" cellRender={cellRenderBold} />
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
