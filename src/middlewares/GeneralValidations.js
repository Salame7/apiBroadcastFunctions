// server.js
/*
El propósito de esta clase es analizar el contenido de los JSON que lleguen
con POST para validar que cumplen con el esquema propuesto, con esto nos referimos
a que email sea string y no un número 

Este middleware se recomienda analizar sí realmente es necesario, en caso de que no,
sugerimos que solo se validen los datos en el front (Esto no es opcional)
*/

/*  ESTAS SON LAS FUNCIONES DE VERIFICACIÓN DE userController  */

'use strict';
// API endpoint for adding data
async function inicio_sesion(req, res, next) {
  const esquema = {
      correo_electronico: "string",
      contrasena: "string"
  };

  const error = validarTipos(req.body, esquema);
  if (error) {
      return res.status(400).json({
          error: error.error,
          message: req.body
      });
  }

  next();
}

async function registro(req, res, next) {
  const esquema = {
      nombre: "string",
      apellido: "string",
      fecha_nacimiento: "string",
      numero_telefono: "string",
      correo_electronico: "string",
      contrasena: "string",
      tipo_usuario: "number"
  };

  const error = validarTipos(req.body, esquema);
  if (error) {
      return res.status(400).json({
          error: error.error,
          message: req.body
      });
  }

  next();
}

async function update_user(req, res, next) {
  const esquema = {
      nombre: "string",
      apellido: "string",
      fecha_nacimiento: "string",
      numero_telefono: "string",
      correo_electronico: "string",
      contrasena: "string",
      tipo_usuario: "number"
  };

  const error = validarTipos(req.body, esquema);
  if (error) {
      return res.status(400).json({
          error: error.error,
          message: req.body
      });
  }

  next();
}
  
  async function agregar_bebe(req,res, next){
    let{correo_electronico, clave_bebe} = req.body;

    let data ={
      correo_electronico: correo_electronico,
      clave_bebe: clave_bebe
    }

    if(typeof correo_electronico != "string"){
      return res.status(400).json({
        error: 'Error en el tipo de variable de correo_electronico',
        message: data
      });
    }
    
    if(typeof clave_bebe != "string"){
      return res.status(400).json({
        error: 'Error en el tipo de variable de clave_bebe',
        message: data
      });
    }
      next();
  }

  async function registro_update_bebe(req, res, next) {
    let {
        nombre, apellido, fecha_nacimiento, genero, grupo_sanguineo,
        alergias, condiciones_medicas, clave_bebe
    } = req.body;

    let data = {
        nombre, apellido, fecha_nacimiento, genero, grupo_sanguineo,
        alergias, condiciones_medicas, clave_bebe
    };

    const esquema = {
        nombre: "string",
        apellido: "string",
        fecha_nacimiento: "string",
        genero: "number",
        grupo_sanguineo: "string",
        alergias: "string",
        condiciones_medicas: "string",
        clave_bebe: "string"
    };

    const error = validarTipos(data, esquema);
    if (error) {
        return res.status(400).json({
            error: error.error,
            message: data
        });
    }

    next();
}

  /*ESTAS SON LAS FUNCIONES DE VERIFICACION DE Crecimiento*/

  async function crecimiento_registro(req, res, next) {

    const esquema = {
        fecha: "string",
        altura: "number",
        diametro_cefalico: "number",
        peso: "number",
        notas: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({ 
            error: error.error 
        });
    }

    next();
}

async function actualizacion_crecimiento(req, res, next) {
  const esquema = {
      _id_crecimiento: "string",
      fecha: "string",
      altura: "number",
      diametro_cefalico: "number",
      peso: "number",
      notas: "string"
  };

  const error = validarTipos(req.body, esquema);
  if (error) {
      return res.status(400).json({
          error: 'El formulario de actualizacion de crecimiento tiene un error',
          detalles: error.error,
          datos: req.body
      });
  }

  next();
}


  /* VALIDACIONES DE lactationController*/
  async function registro_lactancia(req, res, next) {
    const esquema = {
        nombre: "string",
        fecha: "string",
        hora_inicio: "string",
        hora_fin: "string",
        seno: "number",
        notas: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Existe un error en el formulario de registro de lactancia',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}

async function actualizacion_lactancia(req, res, next) {
    const esquema = {
        _id_lactancia: "string",
        nombre: "string",
        fecha: "string",
        hora_inicio: "string",
        hora_fin: "string",
        seno: "number",
        notas: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Existe un error en el formulario de actualización de lactancia',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}


  /*VALIDACIONES DE vaccinationController*/

async function registerValidationsVaccination(req, res, next) {
    const esquema = {
        edad_vacuna: "string",
        fecha: "string",
        lugar_inyeccion: "number",
        lugar: "string",
        notas: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Existe un error en el formulario de registro de vacunacion',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}

async function actualizacion_vacunacion(req, res, next) {
    const esquema = {
        _id_vacunas: "string",
        edad_vacuna: "string",
        fecha: "string",
        lugar_inyeccion: "number",
        lugar: "string",
        notas: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Hay un error en el formulario de actualizacion de vacunas',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}


async function deleteVaccination(req, res, next) {
    const esquema = {
        _id: "string",
        _id_vacunas: "string",
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Hay un error en el formulario de delete de vacunas',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}

  //Validaciones de registro de sonido

  async function registro_sonido(req, res, next) {
    const esquema = {
        correo_electronico: "string",
        estado: "number"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Hay un error en el registro de sonido',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}

/* async function historial_sonido(req, res, next) {
    const esquema = {
        _id_user: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'El campo _id_user presenta un error',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
} */


  //Validaciones de temperatura

  async function registro_temperatura(req, res, next) {
    const esquema = {
        correo_electronico: "string",
        nivel_temperatura: "number",
        estado: "number"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'Existe un problema al registrar los datos de temperatura',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
}

/* async function historial_temperatura(req, res, next) {
    const esquema = {
        _id_user: "string"
    };

    const error = validarTipos(req.body, esquema);
    if (error) {
        return res.status(400).json({
            error: 'El campo _id_user presenta un error',
            detalles: error.error,
            datos: req.body
        });
    }

    next();
} */


module.exports = {
    inicio_sesion, registro,
    update_user, agregar_bebe, registro_update_bebe,
    crecimiento_registro, actualizacion_crecimiento,
    registro_lactancia, actualizacion_lactancia,
    registerValidationsVaccination, actualizacion_vacunacion,
    deleteVaccination,registro_sonido, registro_temperatura
};


function validarTipos(datos, esquema) {
  for (const [clave, tipoEsperado] of Object.entries(esquema)) {
      if (typeof datos[clave] !== tipoEsperado) {
          return {
              error: `Hay un problema en el tipo de dato de ${clave}. Se esperaba ${tipoEsperado}, pero se recibió ${typeof datos[clave]}.`
          };
      }
  }
  return null;
}
