import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components/Link';
import { Layout } from 'components/Layout';
import { userService } from 'services/user.service';

export default Login;

function Login() {
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }) {
        return userService.login(username, password)
            .then((response) => {
                console.log("RESPONSE");            
                console.log(response);         
                console.log("META");         
                console.log(response.meta); 
                userService.setUserValue(response.data);
                console.log("USER DATA");
                console.log(userService.userData);
                console.log(userService.userData.id);
                console.log(userService.userData.username);
                console.log(userService.userData.email);
                console.log(userService.userData.auth_token);
                
                // get return url from query parameters or default to '/'
                // const returnUrl = router.query.returnUrl || '/';
                router.push('/');
            })
            .catch(function(error){
                console.log("ERROR HERE: "+error)
                setError('apiError', { message: "User Authentication failed" });
            });
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        <Link href="/register" className="btn btn-link">Register</Link>
                        {errors.apiError &&
                            <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
                        }
                    </form>
                </div>
            </div>
        </Layout>
    );
}