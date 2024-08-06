import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
type Props = {
    close: Function
    confirm: Function
}

export default function InitialDataPop({close, confirm}: Props) {

    return <section className='back-blur'>
        <section className='pop initial-data-pop'>
            <header>
                <h1>Cargar datos locales</h1>
                <button onClick={()=>{close()}}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </header>
            <input
                type='file'
                id='initial-data-local-input'
                onChange={(event) => {
                    if(!event.target || !event.target.files) return
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const content = e.target!.result;
                            confirm(JSON.parse(content as string));
                        };
                        reader.readAsText(file);
                    }
                }}
            ></input>
            <label className='default-button' htmlFor="initial-data-local-input">
                <FontAwesomeIcon icon={faUpload}/>
                <p>Arrastra o selecciona el archivo</p>
            </label>
            <button className='secondary-button' onClick={()=>{close()}}>Cancelar</button>
        </section>
    </section>
}