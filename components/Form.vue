<script setup>
import {ref} from 'vue'

const tokens = defineProps(['tokens', 'chst'])


let deal_type = []
let deal_type_raw = await $fetch(`https://${tokens.tokens.domain}/rest/crm.status.list?scope=&auth=${tokens.tokens.access_token}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: {
        filter: {ENTITY_ID: 'DEAL_TYPE'}
    }
});
deal_type_raw.result.forEach((type) => {
    deal_type.push({
        value: type.STATUS_ID,
        label: type.NAME
    })
})

const deal_type_id = ref()

const page = ref(1)

const contact_id = ref()

const phone = ref()
const name = ref()
const address = ref()
const user_id = ref()
const deal_user_id = ref([])
const date = ref()
const date_end = ref()
const comments = ref()
const deal_name = ref()
let phoneNumber

const userListRaw = await $fetch(`https://${tokens.tokens.domain}/rest/user.search?scope=&auth=${tokens.tokens.access_token}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
});
const userList = ref([])
userListRaw.result.forEach((user) => {
    userList.value.push({
        label: user.NAME + ' ' + user.LAST_NAME,
        value: user.ID
    })
})
const search_user = async(val) => {
    let userRaw = await $fetch(`https://${tokens.tokens.domain}/rest/user.search?scope=&auth=${tokens.tokens.access_token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            filter: {"NAME": '%'+val+'%'}
        }
    });
    userList.value = []
    userRaw.result.forEach((user) => {
        userList.value.push({
            label: user.NAME + ' ' + user.LAST_NAME,
            value: user.ID
        })
    })
}

const getContact = async (phoneNumber) => {
    async function contacts(phoneNumber) {
        return await $fetch(`https://${tokens.tokens.domain}/rest/crm.contact.list?scope=&auth=${tokens.tokens.access_token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "filter": { "PHONE": phoneNumber },
                // "select": [ "ID", "NAME", "ADDRESS", "ASSIGNED_BY_ID"]
            })
        });
    }
    try {
        let contact = await contacts(phoneNumber)
        if(!contact.result.length) {
            phoneNumber = phoneNumber.split('+7')
            phoneNumber = '8' + phoneNumber[1]
            contact = await contacts(phoneNumber)
        }
        return contact.result
    } catch(e) {
        return []
    }
}

const openNotificationWithIcon = (type, title, description) => {
  notification[type]({
    message: title,
    description: description,
    duration: 5
  });
};

const getByPhone = async () => {
    if(phone.value) {
        const phoneRegex = /^(7|8)?(\d{11})$/;
        phoneNumber = phone.value.replace(/\D/g, '');
        if(phoneRegex.test(phoneNumber)) {
            phoneNumber = phoneNumber.split('')
            if(phoneNumber[0] == '8' || phoneNumber[0] == '7') {
                phoneNumber[0] = '+7'
            }
            phoneNumber = phoneNumber.join('')
            let contacts = await getContact(phoneNumber)
            if(!contacts.length) {
                openNotificationWithIcon('info', 'Не было найдено ни одной сделки', 'Сделка будет создана автоматически')
            } else {
                openNotificationWithIcon('info', 'Была найдена '+contacts.length+ ' сделка', 'Если их более 2-х, проверьте их во вкладке CRM, по-умолчанию будет использованная 1 полученная сделка')
            }
            contact_id.value = contacts[0]
        } else {
            openNotificationWithIcon('error', 'Неправильный номер телефона', 'Проверьте правильность написания номера телефона. Он должен быть в формате +7/8 900 000 00 00')
        }
    } else {
        openNotificationWithIcon('error', 'Необходимо ввести номер телефона', 'Он должен быть в формате +7/8 900 000 00 00')
    }
}

const next = async () => {
    if(phone.value && name.value && address.value && user_id.value) {
        await getByPhone()
        page.value++
    } else {
        openNotificationWithIcon('error', 'Введите все необходимые данные', '')
    }
}
const down = () => {
    page.value--
}

const createDeal = async (data) => {
    let deal = await $fetch(`https://${tokens.tokens.domain}/rest/crm.deal.add?scope=&auth=${tokens.tokens.access_token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                "TITLE": data.title,
                "TYPE_ID": data.type_id, 
                "CONTACT_ID": data.contact_id,
                "ASSIGNED_BY_ID": data.user_id,
                "CLOSEDATE": data.date,
                "COMMENTS": data.comm			
            },
            params: { "REGISTER_SONET_EVENT": "Y" }
        }
    });
}

const createContact = async (data) => {
    let contact = await $fetch(`https://${tokens.tokens.domain}/rest/crm.contact.add?scope=&auth=${tokens.tokens.access_token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            fields: {
                "NAME": data.name + ' ' + data.address,
                "ASSIGNED_BY_ID": data.user_id,
                "TYPE_ID": "CLIENT",
                "ADDRESS": data.address,
                "PHONE": [ { "VALUE": data.phoneNumber, "VALUE_TYPE": "WORK" } ]
            },
            params: { "REGISTER_SONET_EVENT": "Y" }
        }
    });
    return contact.result
}


const finish = async () => {
    try {
        if(date.value && deal_type_id.value && date_end.value && address.value) {
            userList.value = []
            userListRaw.result.forEach((user) => {
                userList.value.push({
                    label: user.NAME + ' ' + user.LAST_NAME,
                    value: user.ID
                })
            })
            let dateString = date.value.split('-')[1]+''+date.value.split('-')[2]+''+date.value.split('-')[0]
            let use
            let use_name = ''
            deal_user_id.value.forEach((u) => {
                if(Number(u)) {
                    use = u
                    userList.value.forEach((uu) => {
                        if(u == uu.value) {
                            use_name += uu.label + ' '
                        }
                    })
                } else {
                    use_name += u+' '
                }
            })
            let data = {
                title: '',
                type_id: deal_type_id.value,
                contact_id: 0,
                date: date_end.value,
                user_id: use,
                comm: comments.value
            }
            if(contact_id.value) {
                data.title = dateString + ' ' + deal_name.value + ' ' + contact_id.value.NAME + ' ' + address.value + ' ' + use_name
                data.contact_id = contact_id.value.ID
            } else {
                contact_id.value = await createContact({
                    name: name.value,
                    address: address.value,
                    user_id: user_id.value,
                    phoneNumber: phoneNumber
                })
                data.title = dateString + ' ' + deal_name.value + ' ' + name.value + ' ' + address.value + ' ' + use_name
                data.contact_id = contact_id.value
            }
            await createDeal(data)
            tokens.chst()
        } else {
            openNotificationWithIcon('error', 'Введите все необходимые данные', '')
        }
    } catch(e) {
        openNotificationWithIcon('error', 'Что-то пошло не так, попробуйте перезагрузить приложение', '')
    }
}
</script>
<template>
    <div class="w-2/5 rounded-lg bg-gray-50 m-auto">
        <CloseOutlined class="text-black close" @click="tokens.chst" style="margin-left: 95%;" />
        <a-form v-show="page == 1" id="form" class="p-5">
            <a-form-item label="Номер телефона клиента">
                <a-input v-model:value="phone"></a-input>
            </a-form-item>
            <a-form-item label="Имя клиента">
                <a-input v-model:value="name"></a-input>
            </a-form-item>
            <a-form-item label="Адресс клиента">
                <a-input v-model:value="address"></a-input>
            </a-form-item>
            <a-form-item label="Ответственный">
                <a-select 
                    show-search 
                    :filterOption="false" 
                    :options="userList" 
                    :default-active-first-option="true"
                    @search="(val) => {search_user(val)}" 
                    ref="select" 
                    v-model:value="user_id">
                </a-select>
            </a-form-item>
            <div style="text-align: end;">
                <a-button @click="next">Следующая</a-button>
            </div>
        </a-form>

        <a-form v-show="page == 2" id="form" class="p-5">
            <a-form-item label="Дата сделки">
                <a-input type="date" v-model:value="date"></a-input>
            </a-form-item>
            <a-form-item label="Дата завершения">
                <a-input type="date" v-model:value="date_end"></a-input>
            </a-form-item>
            <a-form-item label="Название сделки">
                <a-input v-model:value="deal_name"></a-input>
            </a-form-item>
            <a-form-item label="Описание сделки">
                <a-textarea autoSize v-model:value="comments"></a-textarea>
            </a-form-item>

            <a-form-item label="Тип сделки">
                <a-select 
                    show-search 
                    :filterOption="false" 
                    :options="deal_type" 
                    :default-active-first-option="true"
                    ref="select" 
                    v-model:value="deal_type_id">
                </a-select>
            </a-form-item>

            <a-form-item label="Ответственные за сделку">
                <a-select 
                    show-search 
                    :filterOption="false" 
                    :options="userList" 
                    :default-active-first-option="true"
                    @search="(val) => {search_user(val)}" 
                    ref="select" 
                    mode="tags"
                    v-model:value="deal_user_id">
                </a-select>
            </a-form-item>
            <div style="text-align: end;">
                <a-button @click="down">Назад</a-button>
                <a-button @click="finish">Создать</a-button>
            </div>
        </a-form>
    </div>
</template>
<style>
#form {
  text-align: start;
}
.ant-row {
  display: block !important;
}
input {
  border: none;
  outline: none;
}
input:hover {
  border: none;
  outline: none;
}
input:focus {
  border: none;
  outline: none;
}
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.close:hover {
    color: rgb(88, 88, 88);
}
</style>