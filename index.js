const tarea = document.querySelector('#Tarea');
const btnAdd = document.querySelector('#btn-add');
const form   = document.querySelector('#form');
const list = document.querySelector('#Lista');
console.log(btnAdd);

// es el  evento que detecta cuando se escribe en el input
tarea.addEventListener('input', () => {
    if (tarea.value === '') {
        btnAdd.disabled = true;
    }
    else {
        btnAdd.disabled = false;
    }
});

const tareasManager = () => {
    let tareas = [];
    const publicApi = {
        añadirTarea: (nuevaTarea) => {
            tareas = tareas.concat(nuevaTarea);
        },
        guardarNavegador: () => {
            localStorage.setItem("listaTareas", JSON.stringify(tareas));
        },
        renderTareas: ()=> {
            //borrar el contenido de la lista
            list.innerHTML = '';

            tareas.forEach(tarea => {

                const ListItem = document.createElement('li');
                ListItem.classList.add('elemento');
                ListItem.id = tarea.id;

                const contenido = tarea.tarea;

                let btnStatus = '';
                if (tarea.estado === 'chequeada') {
                    btnStatus = 'btnCheck';
                } else {
                    btnStatus = '';
                }
                ListItem.innerHTML = `<div class="inputs-container">
                    <p class="list-item-input ${tarea.estado}">${contenido} </p>
                </div>
                <div  class="btn">
                    <button class="check ${btnStatus}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                          </svg>
                          
                    </button>
                    <button class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          
                    </button>
                </div>`;

                //5 agregar el li a la ul (como un hijo)
                list.append(ListItem);

            })
            
            
        },
        eliminarTarea: (id) => {
            tareas = tareas.filter(tarea => {
                if (id !== tarea.id) {
                    return tarea;
                }
            });
        },
        editarTarea: (tareaEditada) => {
            tareas = tareas.map(tarea => {
                
                if (tareaEditada.id === tarea.id) {
                    
                    return tareaEditada;
                    console.log(tareaEditada)
                } else {
                    
                    return tarea;
                }
            })
        },
        reemplazarTareas: (tareasLocales) => {
            tareas = tareasLocales;
        },
        contadorTareas: () => {
            let contadorTotal = 0;
            let contadorChequeadas = 0;
            let contadorNoChequeadas = 0;
            tareas.forEach(tarea => {
        
                if (tarea.estado === 'chequeada') {
                    contadorChequeadas ++;
                    contadorTotal ++;
                } else {
                    contadorNoChequeadas ++;
                    contadorTotal ++;
                }
            })
        
            const inputTotal = document.querySelector('#total');
            const inputChequeadas = document.querySelector('#completado');
            const inputNochequeadas = document.querySelector('#incompleto');
        
            inputTotal.value = `Total: ${contadorTotal}`;
            inputChequeadas.value = `Completadas: ${contadorChequeadas}`;
            inputNochequeadas.value = `Incompletas: ${contadorNoChequeadas}`;
        }
    }
    return publicApi;
}

const manager = tareasManager();

const chequear = (identificacion, valor, estado) => {

    const tareaEditada = {
        id: identificacion,
        tarea: valor,
        estado: estado
        }
        

        manager.editarTarea(tareaEditada);

        manager.guardarNavegador();
}

list.addEventListener('click', e => {

    const eliminarbtn = e.target.closest('.delete');
    const chequearbtn = e.target.closest('.check');

    if (eliminarbtn) {
        const li = eliminarbtn.parentElement.parentElement;
        const id = li.id;

        manager.eliminarTarea(id);
        manager.guardarNavegador();

        manager.renderTareas();

        manager.contadorTareas();
    }
    if (chequearbtn) {
        const li = chequearbtn.parentElement.parentElement;
        const tareaInput = li.children[0].children[0];
        const valorP = tareaInput.textContent;
        
        if (tareaInput.classList.contains('chequeada')) {
            tareaInput.classList.remove('chequeada');
            chequearbtn.classList.remove('btnCheck');
            
            chequear(li.id, valorP,'noChequeada');
            manager.contadorTareas();
            
        }else {
            tareaInput.classList.add('chequeada');
            chequearbtn.classList.add('btnCheck');
            chequear(li.id, valorP,'chequeada');

            manager.contadorTareas();
        }
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevaTarea = {
        id: crypto.randomUUID(),
        tarea: tarea.value,
        estado: "noChequeado"
    }

    manager.añadirTarea(nuevaTarea)

    manager.guardarNavegador()

    manager.renderTareas();

    manager.contadorTareas();

});

window.onload = () => {
    const obtenerTarea = localStorage.getItem("listaTareas");
    const  tareasLocales = JSON.parse(obtenerTarea);
    if (!tareasLocales) {
        manager.reemplazarTareas([]);
    }else {

        manager.reemplazarTareas(tareasLocales);
    }

    manager.renderTareas();

    manager.contadorTareas();
}