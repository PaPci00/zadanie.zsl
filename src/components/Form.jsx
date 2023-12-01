import { useState } from 'react';

const Form = () => {
    const [formData, setFormData] = useState({
        imie: '',
        nazwisko: '',
        jezyk: '',
        plec: '',
        bio: '',
        obywatelstwo: '',
    });

    const [errors, setErrors] = useState({
        imie: '',
        nazwisko: '',
        jezyk: '',
        plec: '',
        bio: '',
        obywatelstwo: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
                obywatelstwo: 'pl',
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleGenderChange = (e) => {
        setFormData({
            ...formData,
            plec: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://zadanie.zsl/osoba', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log('Dane wysłane na backend.');
                } else {
                    console.error('Błąd podczas wysyłania danych na backend.');
                }
            } catch (error) {
                console.error('Błąd podczas wysyłania danych:', error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (formData.imie.length <= 3) {
            errors.imie = 'Imię musi zawierać więcej niż 3 znaki.';
        }

        if (formData.nazwisko.length <= 3 || formData.nazwisko.length >= 30) {
            errors.nazwisko =
                'Nazwisko musi zawierać więcej niż 3 znaki i mniej niż 30 znaków.';
        }

        if (!formData.jezyk) {
            errors.jezyk = 'Proszę wybrać język.';
        }

        if (!formData.plec) {
            errors.plec = 'Proszę wybrać płeć.';
        }

        if (formData.bio.length <= 30) {
            errors.bio = 'Bio musi zawierać więcej niż 30 znaków.';
        }

        if (formData.isNonCitizen && !formData.obywatelstwo) {
            errors.obywatelstwo = 'Proszę wybrać obywatelstwo.';
        }

        if (!formData.consent) {
            errors.consent = 'Zgoda jest wymagana.';
        }

        return errors;
    };

    return (
        <form onSubmit={handleSubmit}>
            <br />
            {errors.imie && <p>{errors.imie}</p>}
            <label>
                <input
                    type="text"
                    placeholder={"Imię"}
                    name="imie"
                    value={formData.imie}
                    onChange={handleChange}
                />
            </label>
            <br />
            {errors.nazwisko && <p>{errors.nazwisko}</p>}
            <label>
                <input
                    type="text"
                    placeholder={"Nazwisko"}
                    name="nazwisko"
                    value={formData.nazwisko}
                    onChange={handleChange}
                />
            </label>
            <br />
            {errors.jezyk && <p>{errors.jezyk}</p>}
            <label>
                <select
                    name="jezyk"
                    value={formData.jezyk}
                    onChange={handleChange}
                >
                    <option value="">Język</option>
                    <option value="pl">PL</option>
                    <option value="en">EN</option>
                    <option value="uk">UK</option>
                    <option value="de">DE</option>
                </select>
            </label>
            <br />
            {errors.plec && <p>{errors.plec}</p>}
            <label>
                <label>
                    <input
                        type="radio"
                        name="plec"
                        value="m"
                        checked={formData.plec === 'm'}
                        onChange={handleGenderChange}
                    />
                    Mężczyzna
                </label>
                <label>
                    <input
                        type="radio"
                        name="plec"
                        value="k"
                        checked={formData.plec === 'k'}
                        onChange={handleGenderChange}
                    />
                    Kobieta
                </label>
            </label>
            <br />
            {errors.bio && <p>{errors.bio}</p>}
            <label>
        <textarea
            name="bio"
            placeholder={"Bio"}
            value={formData.bio}
            onChange={handleChange}
        />
            </label>
            <br />
            {errors.isNonCitizen && <p>{errors.isNonCitizen}</p>}
            <label>
                <input
                    type="checkbox"
                    name="isNonCitizen"
                    checked={formData.isNonCitizen}
                    onChange={handleChange}
                />
                Nie jestem obywatelem Polski
            </label>
            <br />
            {errors.obywatelstwo && (
                <p>{errors.obywatelstwo}</p>
            )}
            {
                <label>
                    <select
                        name="obywatelstwo"
                        value={formData.obywatelstwo}
                        onChange={handleChange}
                        defaultValue={"pl"}
                    >
                        <option value="">Obywatelstwo</option>
                        <option value="gb">Brytyjskie</option>
                        <option value="ua">Ukraińskie</option>
                        <option value="de">Niemieckie</option>
                    </select>
                </label>
            }
            <br />
            {errors.consent && <p>{errors.consent}</p>}
            <label>
                <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                />
                Zgoda na przetwarzanie danych
            </label>
            <br />
            <button type="submit">Wyślij</button>
        </form>
    );
};

export default Form;
