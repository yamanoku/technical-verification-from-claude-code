// Ripple フレームワーク実装デモ
// 注意: これは概念実証のためのデモコードです
// 実際のrippleフレームワークとは異なる可能性があります

// Ripple-likeなSignal実装（概念実証版）
class Signal {
    constructor(initialValue) {
        this._value = initialValue;
        this._observers = new Set();
    }

    get value() {
        return this._value;
    }

    set(newValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this._notify();
        }
    }

    update(updater) {
        this.set(updater(this._value));
    }

    _notify() {
        this._observers.forEach(observer => observer());
    }

    subscribe(observer) {
        this._observers.add(observer);
        return () => this._observers.delete(observer);
    }
}

function signal(initialValue) {
    return new Signal(initialValue);
}

function computed(fn) {
    const computedSignal = new Signal(fn());
    
    // 実際のrippleでは依存関係の自動追跡が行われるが、
    // ここでは簡略化した実装
    const update = () => {
        computedSignal.set(fn());
    };
    
    // グローバルな依存関係追跡システムが必要だが、
    // デモとしてはupdate関数を返す
    computedSignal._update = update;
    return computedSignal;
}

// Counter コンポーネント（Ripple-like実装）
function createCounter(container) {
    const count = signal(0);
    
    const increment = () => count.set(count.value + 1);
    const decrement = () => count.set(count.value - 1);
    
    const render = () => {
        container.innerHTML = `
            <div class="counter">
                <h3>Counter: ${count.value}</h3>
                <button id="increment">+</button>
                <button id="decrement">-</button>
                <button id="reset">Reset</button>
            </div>
            <style>
                .counter {
                    text-align: center;
                    padding: 20px;
                }
                .counter button {
                    margin: 0 10px;
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background: #007bff;
                    color: white;
                }
                .counter button:hover {
                    background: #0056b3;
                }
            </style>
        `;
        
        // イベントリスナーの再登録
        container.querySelector('#increment').onclick = increment;
        container.querySelector('#decrement').onclick = decrement;
        container.querySelector('#reset').onclick = () => count.set(0);
    };
    
    // Signal変更時の自動再描画
    count.subscribe(render);
    render();
}

// TodoList コンポーネント（Ripple-like実装）
function createTodoList(container) {
    const todos = signal([]);
    const newTodo = signal('');
    
    const addTodo = () => {
        if (newTodo.value.trim()) {
            todos.update(prev => [
                ...prev,
                { 
                    id: Date.now(), 
                    text: newTodo.value.trim(), 
                    completed: false 
                }
            ]);
            newTodo.set('');
        }
    };
    
    const toggleTodo = (id) => {
        todos.update(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };
    
    const deleteTodo = (id) => {
        todos.update(prev => prev.filter(todo => todo.id !== id));
    };
    
    const completedCount = computed(() => 
        todos.value.filter(todo => todo.completed).length
    );
    
    const totalCount = computed(() => todos.value.length);
    
    const render = () => {
        // computed signalsを更新
        completedCount._update();
        totalCount._update();
        
        container.innerHTML = `
            <div class="todo-app">
                <div class="add-todo">
                    <input 
                        id="todo-input"
                        placeholder="Add a new todo..."
                        value="${newTodo.value}"
                    />
                    <button id="add-btn">Add</button>
                </div>
                
                <div class="stats">
                    Completed: ${completedCount.value} / ${totalCount.value}
                </div>
                
                <ul class="todo-list">
                    ${todos.value.map(todo => `
                        <li class="${todo.completed ? 'completed' : ''}">
                            <input 
                                type="checkbox" 
                                ${todo.completed ? 'checked' : ''}
                                data-id="${todo.id}"
                                class="todo-checkbox"
                            />
                            <span class="todo-text">${todo.text}</span>
                            <button class="delete-btn" data-id="${todo.id}">削除</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <style>
                .todo-app {
                    max-width: 500px;
                    margin: 0 auto;
                }
                .add-todo {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .add-todo input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .add-todo button {
                    padding: 10px 20px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .stats {
                    margin-bottom: 20px;
                    font-weight: bold;
                    color: #666;
                }
                .todo-list {
                    list-style: none;
                    padding: 0;
                }
                .todo-list li {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    gap: 10px;
                }
                .todo-list li.completed .todo-text {
                    text-decoration: line-through;
                    opacity: 0.6;
                }
                .todo-text {
                    flex: 1;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                }
            </style>
        `;
        
        // イベントリスナーの登録
        const input = container.querySelector('#todo-input');
        const addBtn = container.querySelector('#add-btn');
        
        input.oninput = (e) => newTodo.set(e.target.value);
        input.onkeydown = (e) => e.key === 'Enter' && addTodo();
        addBtn.onclick = addTodo;
        
        // チェックボックスのイベント
        container.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.onchange = () => toggleTodo(parseInt(checkbox.dataset.id));
        });
        
        // 削除ボタンのイベント
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => deleteTodo(parseInt(btn.dataset.id));
        });
    };
    
    // Signal変更時の自動再描画
    todos.subscribe(render);
    newTodo.subscribe(render);
    render();
}

// Signal リアクティビティ デモ
function createSignalDemo(container) {
    const name = signal('Ripple');
    const count = signal(0);
    const message = computed(() => `Hello, ${name.value}! Count: ${count.value}`);
    
    const render = () => {
        message._update(); // computed signalを更新
        
        container.innerHTML = `
            <div class="signal-demo">
                <div class="form-group">
                    <label>Name:</label>
                    <input id="name-input" value="${name.value}" />
                </div>
                <div class="form-group">
                    <label>Count:</label>
                    <input id="count-input" type="number" value="${count.value}" />
                </div>
                <div class="message">
                    <strong>Computed Message:</strong> ${message.value}
                </div>
                <div class="info">
                    <p>🔄 上記の入力を変更すると、Signal-basedリアクティビティにより自動的に下のメッセージが更新されます。</p>
                </div>
            </div>
            <style>
                .signal-demo .form-group {
                    margin-bottom: 15px;
                }
                .signal-demo label {
                    display: inline-block;
                    width: 80px;
                    font-weight: bold;
                }
                .signal-demo input {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    width: 200px;
                }
                .message {
                    padding: 15px;
                    background: #e7f3ff;
                    border-left: 4px solid #007bff;
                    margin: 20px 0;
                }
                .info {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #666;
                }
            </style>
        `;
        
        // イベントリスナーの登録
        container.querySelector('#name-input').oninput = (e) => name.set(e.target.value);
        container.querySelector('#count-input').oninput = (e) => count.set(parseInt(e.target.value) || 0);
    };
    
    // Signal変更時の自動再描画
    name.subscribe(render);
    count.subscribe(render);
    render();
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    createCounter(document.getElementById('counter-app'));
    createTodoList(document.getElementById('todo-app'));
    createSignalDemo(document.getElementById('signal-app'));
    
    console.log('🌊 Ripple Demo Project loaded!');
    console.log('This is a conceptual implementation based on Ripple framework research.');
});