// Declaración del arreglo de personajes
let characterArray = [];

// Obtener los datos de personajes del LocalStorage o inicializar un arreglo vacío
characterArray = JSON.parse(localStorage.getItem('characterData')) || [];

// Obtener el formulario y agregar un evento de envío
const characterRegistry = document.getElementById('characterRegistry');

characterRegistry.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el envío del formulario

  // Obtener los valores de los campos del formulario
  const characterName = document.getElementById('characterNamecontrol').value;
  const characterAge = document.getElementById('characterAgecontrol').value;
  const characterQuirk = document.getElementById('characterQuirkcontrol').value;
  const characterCategory = document.getElementById('characterCategorycontrol').value;
  const characterStatus = document.getElementById('characterStatuscontrol').value;

  // Crear un objeto de personaje con los valores del formulario
  const character = {
    nombre: characterName,
    edad: characterAge,
    quirk: characterQuirk,
    category: characterCategory,
    status: characterStatus
  };

  // Verificar campos vacíos
  if (characterName.trim() === '' || characterAge.trim() === '' || characterQuirk.trim() === '' ||
    characterCategory.trim() === '' || characterStatus.trim() === '') {
    alert("Por favor, completa todos los campos del formulario.");
    return;
  }

  // Validar si el nombre del personaje ya está registrado en la tabla
  const characterRow = document.querySelector(`#characterList tr[data-name="${characterName}"]`);
  if (characterRow) {
    alert("El personaje ya está registrado en la tabla.");
    return;
  }

  // Validar si el nombre del personaje ya está registrado en el arreglo
  const existingCharacterIndex = characterArray.findIndex((c) => c.nombre === characterName);
  if (existingCharacterIndex !== -1) {
    // Si el nombre del personaje está repetido, mostrar una alerta y detener la propagación del evento
    alert("El nombre del personaje ya está registrado. Por favor, elige otro nombre.");
    return;
  }

  // Agregar el personaje al arreglo de personajes
  characterArray.push(character);

  // Actualizar la tabla con los datos guardados
  updateCharacterList();

  // Guardar los datos actualizados en el local storage
  saveCharacterData(characterArray);

  alert("Registro exitoso. El personaje ha sido registrado correctamente.");

  // Restablecer los valores del formulario
  characterRegistry.reset();
});

// Función para guardar los datos de los personajes en el local storage
const saveCharacterData = (characterArray) => {
  localStorage.setItem('characterData', JSON.stringify(characterArray));
};

// Función para actualizar la tabla de personajes
const updateCharacterList = () => {
  const characterList = document.querySelector('#characterList');
  characterList.innerHTML = '';

  // Recorrer el arreglo de personajes y crear una fila por cada uno
  characterArray.forEach((character) => {
    const row = document.createElement('tr');

    // Crear celdas para cada propiedad del personaje y agregarlas a la fila
    const nameCell = document.createElement('td');
    nameCell.textContent = character.nombre;
    row.appendChild(nameCell);

    const ageCell = document.createElement('td');
    ageCell.textContent = character.edad;
    row.appendChild(ageCell);

    const quirkCell = document.createElement('td');
    quirkCell.textContent = character.quirk;
    row.appendChild(quirkCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = character.category;
    row.appendChild(categoryCell);

    const statusCell = document.createElement('td');
    statusCell.textContent = character.status;
    row.appendChild(statusCell);

    const actionsCell = document.createElement('td');
    actionsCell.classList.add( 'text-center');

   // Crear un botón de edición para cada personaje
const editButton = document.createElement('button');
editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Icono de lápiz
editButton.classList.add('btn', 'btn-primary', 'mr-2');
editButton.addEventListener('click', () => {
  const characterIndex = characterArray.findIndex((c) => c.nombre === character.nombre);
  if (characterIndex !== -1) {
    // Mostrar el modal de edición
    const fieldToEdit = prompt("¿Qué desea editar?\n1. Nombre\n2. Edad\n3. Quirk\n4. Categoría\n5. Estado");

    if (fieldToEdit !== null) {
      let newValue;
      switch (fieldToEdit) {
        case "1":
          newValue = prompt("Ingrese el nuevo nombre:");
          break;
        case "2":
          newValue = prompt("Ingrese la nueva edad:");
          break;
        case "3":
          newValue = prompt("Ingrese el nuevo quirk:");
          break;
        case "4":
          newValue = prompt("Ingrese la nueva categoría:");
          break;
        case "5":
          newValue = prompt("Ingrese el nuevo estado:");
          break;
        default:
          alert("Opción inválida.");
          return;
      }

      // Verificar si se ingresó un nuevo valor
      if (newValue !== null) {
        // Obtener los datos del personaje seleccionado
        const { nombre, edad, quirk, category, status } = characterArray[characterIndex];

        // Actualizar el campo correspondiente con el nuevo valor
        switch (fieldToEdit) {
          case "1":
            characterArray[characterIndex].nombre = newValue;
            break;
          case "2":
            characterArray[characterIndex].edad = newValue;
            break;
          case "3":
            characterArray[characterIndex].quirk = newValue;
            break;
          case "4":
            characterArray[characterIndex].category = newValue;
            break;
          case "5":
            characterArray[characterIndex].status = newValue;
            break;
        }

        // Actualizar la tabla con los datos actualizados
        updateCharacterList();

        // Guardar los datos actualizados en el local storage
        saveCharacterData(characterArray);

        alert(`El campo "${fieldToEdit}" ha sido actualizado correctamente.`);
      }
    }
  }
});

    // Agregar el botón de edición a la celda de acciones
    actionsCell.appendChild(editButton);

    // Crear un botón de eliminación para cada personaje
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Icono de basura
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.addEventListener('click', () => {
      // Mostrar el modal de confirmación
      const confirmation = confirm("¿Estás seguro de que deseas eliminar este personaje?");

      if (confirmation) {
        // Eliminar el personaje del arreglo y actualizar la tabla
        characterArray = characterArray.filter((c) => c.nombre !== character.nombre);
        updateCharacterList();
        saveCharacterData(characterArray);
        alert("El personaje ha sido eliminado correctamente.");
      }
    });

    // Agregar el botón de eliminación a la celda de acciones
    actionsCell.appendChild(deleteButton);

    // Agregar la celda de acciones a la fila
    row.appendChild(actionsCell);

    // Agregar el atributo data-name al elemento <tr> con el nombre del personaje
    row.setAttribute('data-name', character.nombre);

    // Agregar la fila a la tabla
    characterList.appendChild(row);
  });
};

// Obtener el botón "Cambiar categoría" por su identificador
const changeCategoryButton = document.getElementById('changeCategoryButton');

// Agregar un evento de clic al botón
changeCategoryButton.addEventListener('click', function() {
  // Definir el diccionario de categorías
  const roles = {
    1: 'Búsqueda',
    2: 'Civil',
    3: 'Estudiante de U.A.',
    4: 'Pro Héroe',
    5: 'Héroe',
    6: 'Villano'
  };

  // Construir el mensaje de la alerta con el diccionario de categorías
  let message = 'Diccionario de Categorías:\n\n';
  for (const key in roles) {
    message += `${key}: ${roles[key]}\n`;
  }

  // Mostrar la alerta con el mensaje del diccionario de categorías
  alert(message);
});

// Odenar
let sortClicks = 0;

const sortButton = document.querySelector('.btn-secondary');
sortButton.addEventListener('click', () => {
  sortClicks++;

  // tabla de personajes
  const characterTable = document.querySelector('#characterList');

  // Obtener las filas de la tabla
  const rows = Array.from(characterTable.querySelectorAll('tr'));

  // Obtener la columna correspondiente para ordenar según el número de clics
  let columnIndex;
  switch (sortClicks % 3) {
    case 1:
      columnIndex = 0; // Nombre
      break;
    case 2:
      columnIndex = 1; // Edad
      break;
    case 0:
      columnIndex = 3; // Categoría
      break;
  }

  // Ordenar las filas según el contenido de la columna seleccionada
  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[columnIndex].textContent;
    const cellB = rowB.querySelectorAll('td')[columnIndex].textContent;

    if (cellA < cellB) {
      return -1;
    }
    if (cellA > cellB) {
      return 1;
    }
    return 0;
  });

  //  orden descendente)
  if (sortClicks % 3 === 2) {
    rows.reverse();
  }

  // Remover las filas existentes de la tabla
  rows.forEach(row => characterTable.removeChild(row));

  // Agregar las filas ordenadas a la tabla
  rows.forEach(row => characterTable.appendChild(row));
});

// busqueda- algoritmo de busqueda binario

// Obtener elementos del DOM
const searchInput = document.getElementById('characterNameFilter');
const characterList = document.querySelector('#characterList');

// Evento input del campo de búsqueda
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Evitar que se envíe el formulario al presionar Enter

    const searchValue = searchInput.value.trim();

    // Verificar si el valor de búsqueda está vacío
    if (searchValue === '') {
      updateCharacterList(characterArray);
      return;
    }

    // Realizar la búsqueda binaria en el arreglo de personajes
    const searchResultIndex = binarySearch(characterArray, searchValue);

    if (searchResultIndex !== -1) {
      const searchResult = characterArray[searchResultIndex];
      // Actualizar la lista con el resultado de búsqueda
      updateCharacterList([searchResult]);
      alert(`El personaje "${searchValue}" se encontró en la posición ${searchResultIndex}.`);
    } else {
      // No se encontró ningún personaje con el nombre especificado
      updateCharacterList([]);
      alert(`No se encontró ningún personaje con el nombre "${searchValue}".`);
    }
  }
});







// Actualizar la tabla de personajes al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  updateCharacterList();
});
