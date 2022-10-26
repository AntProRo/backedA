import { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import Image from "next/image";
import NewClientButton from "../../../components/ModalComponents/Client/newClient";
import ClientInfo from "../../../components/ModalComponents/Client/getClientInfo";
import { clientService } from "../../../service/clientService";
import DeleteClient from "../../../components/ModalComponents/Client/Options/DeleteClient";
import roleAccess from "../../Role/Manager/roleAccess";
import { AuthContext } from "../../../context";

function Index() {
  const state = useContext(AuthContext);
  const [callback, setCallback] = state.User.callback;
  const [infoModal, setInfoModal] = useState(false);
  const [itemMT, setItemMT] = useState();
  const [client, setClients] = useState([]);
  const [itemsClients] = state.User.itemsClients
/*   const { getClientList } = clientService();

  const getClient = async () => {
    
      await getClientList().then((res) => {
       setClients(res.data.result);
        
  
      }); 
    
     
  };
  useEffect(() => {
    getClient();
  }, []); */

  return (
    <>
      <br />
      <div className="content-wrap">
        <NewClientButton />
        <br />
        <div className="gridClient">
          {Array.isArray(itemsClients)
            ? itemsClients.map((item) => {
                return (
                  <div
                    className="card mb-3"
                    key={item._id}
                    style={{ margin: "1rem" }}
                  >
                    <Image
                      className="card-img-top"
                      width={200}
                      height={150}
                      src="https://res.cloudinary.com/antoapex19/image/upload/v1663555285/A-Project/pexels-steve-johnson-1509534_auueyi.jpg"
                      alt="Card client"
                      priority
                    />
                    <div className="card-body">
                      <h5 className="card-title">Client: {item.name}</h5>
                      <div className="card-text text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setInfoModal(true), setItemMT(item._id);
                          }}
                          className="btn btn-primary btn-small"
                        >
                          See more
                        </button>
                        {/* &nbsp;
                        <button
                          type="button"
                          className="btn btn-warning btn-small"
                        >
                          Update information
                        </button> */}
                        &nbsp;
                        <DeleteClient item={item} clientStatus={true}/>
                        <ClientInfo
                          show={infoModal}
                          onHide={() => {
                            setInfoModal(false);
                          }}
                          item={itemMT}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </>
  );
}

export default roleAccess(Index);
