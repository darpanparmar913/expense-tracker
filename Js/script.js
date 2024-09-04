// new DataTable('#example');
$(document).ready(function () {
    $('#example').DataTable({
        responsive: true
    });
});


// Sign Up Data Set Functionallity --------------------------------------

function signUpfunc() {

    $.validator.addMethod("alphabetsnspace", function (value, element) {
        return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
    });
    $('#register-form').validate({
        rules: {
            name: {
                required: true,
                alphabetsnspace: true
            },
            userEmail: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            name: {
                required: "Please enter the name",
                alphabetsnspace: "Enter only latters"
            },
            userEmail: {
                required: "Please enter the email",
                email: "Please enter valid email"
            },
            password: {
                required: "Please enter the password",
                minlength: "password must be 6 char long"
            }
        },
        submitHandler: function () {
            let signUpname = document.getElementById('UserName').value;
            let signUpemail = document.getElementById('UserEmail').value;
            let signUppassword = document.getElementById('UserPassword').value;

            let secret = "Q&2|RY0,HDrn7zm";
            var encrypted = CryptoJS.AES.encrypt(signUppassword, secret).toString();

            let signUpobj = {
                userId: Math.floor(Math.random() * 1000),
                signUpname,
                signUpemail,
                encrypted
            }
            console.log(signUpobj, "signUpobj");

            let getData = JSON.parse(localStorage.getItem('UserList')) ? JSON.parse(localStorage.getItem('UserList')) : [];

            localStorage.setItem('UserList', JSON.stringify([...getData, signUpobj]));

            document.getElementById('UserName').value = "";
            document.getElementById('UserEmail').value = "";
            document.getElementById('UserPassword').value = "";
            window.location.href = "signIn.html";
        }

    })

}

// Sign In Data Set Functionallity --------------------------------------

function signInfunc() {

    $.validator.addMethod("alphabetsnspace", function (value, element) {
        return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
    });
    $('#register-form').validate({
        rules: {
            loginUserName: {
                required: true,
                alphabetsnspace: true
            },
            loginUserPassword: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            loginUserName: {
                required: "Please enter the name",
                alphabetsnspace: "Enter only latters"
            },
            loginUserPassword: {
                required: "please enter password",
                minlength: "password must be 6 char long"
            }
        },
        submitHandler: function () {
            let getData = JSON.parse(localStorage.getItem('UserList'));
            console.log(getData, "getitem");

            let NameSignIN = document.getElementById('UserNameForSignIN').value;
            let PasswordSignIN = document.getElementById('UserPasswordForSignIN').value;

            function decryptPassword(encryptedPassword, key) {
                if (!encryptedPassword || encryptedPassword.trim() === "") {
                    Swal.fire("Password Is Not Define !");
                }
                const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
                return bytes.toString(CryptoJS.enc.Utf8);
            }

            const decryptedPasswords = getData.map(user => {
                return {
                    ...user,
                    encrypted: decryptPassword(user.encrypted, 'Q&2|RY0,HDrn7zm')
                };
            });

            let sIuser = decryptedPasswords.filter((val) => {
                if (val.encrypted == PasswordSignIN && val.signUpname == NameSignIN) {
                    window.location.href = "chartPage.html";
                    return val.userId;
                }
                else {
                    $(document).ready(function () {
                        $("#wrong_pass").text("Your Password Is Wrong !");
                    });
                }
            });
            let userId = sIuser[0].userId;
            localStorage.setItem("LoginUser", JSON.stringify(userId));

            document.getElementById('UserNameForSignIN').value = "";
            document.getElementById('UserPasswordForSignIN').value = "";
        }
    })

}


// Add New Expanse Data Set Functionallity --------------------------------------

function addExpanse() {

    $.validator.addMethod('ForSelect', function (value, element, peram) {
        return value != 0;
    }, 'Please Select Category');
    $.validator.addMethod("alphabetsnspace", function (value, element) {
        return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
    });
    $('#Expense_form').validate({
        rules: {
            Exname: {
                required: true,
                alphabetsnspace: true
            },
            ExAmount: {
                required: true
            },
            Exdate: {
                required: true
            },
            Excategory: {
                ForSelect: true
            }
        },
        messages: {
            Exname: {
                required: "Please enter the name",
                alphabetsnspace: "Enter only latters"
            },
            ExAmount: {
                required: "Enter the Amount !"
            },
            Exdate: "Please select the Date !"
        },
        submitHandler: function () {
            let ExpenseName = document.getElementById('ExName').value;
            let ExpenseAmount = document.getElementById('ExAmount').value;
            let ExpenseDate = document.getElementById('ExDate').value;
            let categoryValue;
            let ExpenseCategory = document.getElementsByName('cate');

            let loginUserId = JSON.parse(localStorage.getItem('LoginUser'));

            ExpenseCategory.forEach((val) => {
                if (val.selected) {
                    categoryValue = val.value
                }
            })
            let addExpanseObj = {
                userId: loginUserId,
                ExpenseId: Math.floor(Math.random() * 1000),
                ExpenseName,
                ExpenseAmount,
                ExpenseDate,
                categoryValue
            }

            Swal.fire({
                title: "Your Expense Is Add !",
                icon: "success"
            });

            let expenseData = JSON.parse(localStorage.getItem('expense')) ? JSON.parse(localStorage.getItem('expense')) : [];
            console.log(expenseData, "ret");
            localStorage.setItem('expense', JSON.stringify([addExpanseObj, ...expenseData]));

            document.getElementById('ExName').value = "";
            document.getElementById('ExAmount').value = "";
            document.getElementById('ExDate').value = "";
            document.getElementById('ExCategory').value = "0";
            dataTable()
        }

    })

}

// Print Data In DataTable Functionallity --------------------------------------

function dataTable() {
    let dataForPrint = JSON.parse(localStorage.getItem('expense'));
    let userIdData = JSON.parse(localStorage.getItem('LoginUser'));

    let originalData = dataForPrint.filter((val) => {
        return val.userId == userIdData
    })

    let Print = "";
    let totalAmount = 0;
    originalData.map((data) => {
        totalAmount = totalAmount + parseInt(data.ExpenseAmount);
        Print +=
            `
        <tr>
            <td>${data.ExpenseName}</td>
            <td>${data.ExpenseAmount}</td>
            <td>${data.ExpenseDate}</td>
            <td>${data.categoryValue}</td>
            <td class="btn_group">
            <button class="editBtn" onclick="setEditPage(${data.ExpenseId})"><i class="fa-regular fa-pen-to-square"></i></button>

            <button class="deleteBtn" onclick="deleteDataBtn(${data.ExpenseId})"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        </tr>
        
        `
    })
    document.getElementById('total_heading').innerHTML = totalAmount;
    document.getElementById('dataPrint').innerHTML = Print;
}
dataTable()
// Delete Data From DataTable Functionallity --------------------------------------

function deleteDataBtn(deleteId) {
    Swal.fire({
        title: "Are you sure Delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let dataForDelete = JSON.parse(localStorage.getItem('expense'));

            let deleteUser = dataForDelete.filter((data) => {
                return data.ExpenseId != deleteId;
            })

            localStorage.setItem('expense', JSON.stringify(deleteUser))

            dataTable();

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

        }
    });

}

// Edit Data From DataTable Functionallity --------------------------------------

function setEditPage(editId) {
    $('#editModal').modal('show');
    let updateData = JSON.parse(localStorage.getItem('expense'));

    let filterForUpdate = updateData.filter((val) => {
        if (val.ExpenseId == editId) {
            $("#EditId").val(val.ExpenseId);
            $("#EditInputName").val(val.ExpenseName);
            $("#EditInputAmount").val(val.ExpenseAmount);
            $("#EditInputDate").val(val.ExpenseDate);
            $("#EditInputCategory").val(val.categoryValue);
        }
    })
}

function EditExpanse() {

    $.validator.addMethod('EditSelect', function (value, element, peram) {
        return value != 0;
    }, 'Please Select Category');
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Letters only please");
    $('#edit_form').validate({
        rules: {
            editName: {
                required: true,
                lettersonly: true
            },
            editAmount: {
                required: true
            },
            editDate: {
                required: true
            },
            editCategory: {
                EditSelect: true
            }
        },
        messages: {
            editName: {
                required: "Please enter the name",
                lettersonly: "Enter only latters"
            },
            editAmount: {
                required: "Enter the Amount !"
            },
            editDate: "Please select the Date !"
        },
        submitHandler: function () {
            let EditedId = $("#EditId").val();
            let EditedName = $("#EditInputName").val();
            let EditedAmount = $("#EditInputAmount").val();
            let EditedDate = $("#EditInputDate").val();
            let EditedCategory = $("#EditInputCategory").val();

            let updateData = JSON.parse(localStorage.getItem('expense'));

            for (let i in updateData) {
                if (updateData[i].ExpenseId == EditedId) {
                    updateData[i].ExpenseName = EditedName
                    updateData[i].ExpenseAmount = EditedAmount
                    updateData[i].ExpenseDate = EditedDate
                    updateData[i].categoryValue = EditedCategory
                }
            }
            localStorage.setItem('expense', JSON.stringify(updateData))
            dataTable();
            window.location.href = "viewExpanse.html"
        }

    })

}

function logOut() {

    Swal.fire({
        title: "Are you sure For Log Out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I Do!"
    }).then((result) => {
        if (result.isConfirmed) {


            // let removeUserId = JSON.parse(localStorage.getItem('expense'));

            // removeUserId.forEach(expense => {
            //     delete expense.userId;
            // });
            // localStorage.setItem('expense', JSON.stringify(removeUserId));

            // // Retrieve the expenses from localStorage
            // let storedExpenses = JSON.parse(localStorage.getItem('expense'));

            // console.log(storedExpenses);

            localStorage.removeItem('LoginUser');
            window.location.href = "signIn.html";

        }
    });


}